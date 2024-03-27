import { Article } from "@/app/page";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { formatDistanceToNow, format } from "date-fns";

const Card = ({
  content,
  title,
  url,
  publishedAt,
  urlToImage,
  source,
  author,
  description,
}: Article) => {
  console.log({
    content,
    title,
    url,
    publishedAt,
    urlToImage,
    source,
    author,
    description,
  });

  const formatDateAgo = (dateString: string) => {
    const date = new Date(dateString);
    const agoString = formatDistanceToNow(date, { addSuffix: true });
    const formattedDate = format(date, "dd/MM/yyyy");
    return `${agoString}`;
  };

  const formattedPublishedAt = formatDateAgo(publishedAt);
  return (
    <div className=" shadow-sm border">
      <Link rel="noopener noreferrer" target="_blank" href={url}>
        {urlToImage && (
          //   <Image
          //     src={urlToImage}
          //     alt={title}
          //     width={0}
          //     height={0}
          //     sizes="100vw"
          //   />
          <img src={urlToImage} className="w-full h-40 object-cover" alt="" />
        )}
        <div className="p-4">
          <h1 className=" text-lg tracking-tight leading-6">{title}</h1>
          <h1 className="  text-xs mt-2 text-gray-600 font-light">
            <span dangerouslySetInnerHTML={{ __html: description || "" }} />
          </h1>
          <div>
            <div className="flex items-center gap-x-2  text-[0.6rem] mt-2 uppercase">
              <p className=" text-blue-600 truncate w-24 font-medium">
                {author ?? "Unknown"}
              </p>{" "}
              | <span>{formattedPublishedAt}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
