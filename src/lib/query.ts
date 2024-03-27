"use server";
import axios from "axios";
import { revalidatePath } from "next/cache";

const NEWS_API_KEY = process.env.NEWS_API_KEY!;

export const fetchQuery = async (
  page: number,
  searchQuery?: string,
  category?: string,
  date?: { from: string; to: string },
  sources?: string,
  country?: string
) => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("page", page.toString());
    searchParams.append("pageSize", "40");
    searchParams.append("apiKey", NEWS_API_KEY);

    if (searchQuery) {
      searchParams.append("q", searchQuery);

      if (date?.from && date?.to) {
        searchParams.append("from", date.from);
        searchParams.append("to", date.to);
      }
    }

    if (sources) {
      searchParams.append("sources", sources);
    } else {
      if (category && !searchQuery) {
        searchParams.append("category", category);
      }
      if (country && !searchQuery) {
        searchParams.append("country", country);
      }
    }

    let endpoint = "https://newsapi.org/v2/top-headlines?";

    if (searchQuery) {
      endpoint = "https://newsapi.org/v2/everything?";
    }

    const response = await axios.get(`${endpoint}${searchParams.toString()}`);
    revalidatePath("/");
    console.log(response, "fishburn");
    return { success: response.data || [] };

    // return {
    //   success: {
    //     status: "ok",
    //     totalResults: 1000,
    //     articles: [],
    //   },
    // };
  } catch (error: any) {
    console.log(error, "herror");
    return { status: "error", message: error?.response?.data?.message };
  }
};

export const sourceQuery = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines/sources?apiKey=${NEWS_API_KEY}`
    );
    return { success: response.data || [] };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong.",
    };
  }
};
