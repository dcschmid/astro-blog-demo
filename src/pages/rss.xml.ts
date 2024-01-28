import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

const parser = new MarkdownIt();

/**
 * Function to handle the GET request.
 *
 * @param {APIContext} context - the API context
 * @return {Promise<object>} an object representing the RSS feed
 */
export async function GET(context: APIContext) {
  const posts = await getCollection("posts");

  return rss({
    title: "Rhythm Nation",
    description: "A community of music producers and enthusiasts.",
    site: context.site?.toString() ?? "",
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: `<atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />`,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body)),
    })),
  });
}
