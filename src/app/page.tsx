import Card from "@/components/Card";
import Filter from "@/components/Filter";

import Search from "@/components/Search";
import TopHeader from "@/components/TopHeader";
import { fetchQuery, sourceQuery } from "@/lib/query";
import { lazy, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface Article {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    category?: string;
    from?: string;
    to?: string;
    sources?: string;
    country?: string;
  };
}) {
  const searchQuery = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const category = searchParams?.category || "general";
  const date = {
    from: searchParams?.from || "",
    to: searchParams?.to || "",
  };
  const sources = searchParams?.sources;
  const country = searchParams?.country;

  const data = await fetchQuery(
    page,
    searchQuery,
    category,
    date,
    sources,
    country
  );
  const sourceData = await sourceQuery();
  const ClientFilter = lazy(() => import("@/components/Filter"));

  return (
    <main className=" ">
      <TopHeader />
      <div className="container mt-5">
        <div className="grid grid-cols-11 gap-4">
          {sourceData.status !== "error" && (
            <div className="lg:col-span-3 sm:col-span-4 col-span-4 hidden sm:block  sm:sticky top-[5rem] border max-h-[50dvh] h-full overflow-auto">
              <Suspense fallback={<p>Loading Filter...</p>}>
                <ClientFilter success={sourceData.success} />
              </Suspense>
            </div>
          )}
          <div className=" lg:col-span-8 sm:col-span-7 col-span-11 masonry lg:columns-3 md:columns-2 gap-4">
            <Suspense fallback={<p>Loading feed...</p>}>
              {data && data?.success?.status === "ok" ? (
                data.success.articles.length > 0 ? (
                  data.success.articles.map((article: Article) => (
                    <div key={article.url} className="mb-4">
                      {/* {console.log(article)} */}
                      <Card
                        title={article.title}
                        url={article.url}
                        urlToImage={article.urlToImage}
                        source={article.source}
                        content={article.content}
                        publishedAt={article.publishedAt}
                        author={article.author}
                        description={article.description}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <p>No articles found.</p>
                  </div>
                )
              ) : (
                <Dialog open={true}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Error Message</DialogTitle>
                      <DialogDescription>{data.message}</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
