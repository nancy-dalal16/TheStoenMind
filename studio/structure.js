import { BookIcon } from "@sanity/icons/Book";
import { ClockIcon } from "@sanity/icons/Clock";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { EyeOpenIcon } from "@sanity/icons/EyeOpen";
import { HomeIcon } from "@sanity/icons/Home";
import { StarIcon } from "@sanity/icons/Star";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import PagePreview from "./components/PagePreview";

/**
 * The left-hand menu of /studio: the Explore page settings first, then stories (with handy
 * filtered lists), topics and authors. Stories and the Explore page get a "Page" tab that shows
 * the live page beside the form.
 */
export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Explore page")
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType("explorePage")
            .documentId("explorePage")
            .title("Explore page")
            .views([S.view.form().title("Edit"), S.view.component(PagePreview).title("Page").icon(EyeOpenIcon)]),
        ),
      S.divider(),
      S.listItem()
        .title("Stories")
        .icon(BookIcon)
        .child(
          S.list()
            .title("Stories")
            .items([
              S.listItem()
                .title("All stories")
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList("post")
                    .title("All stories")
                    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("By topic")
                .icon(TagIcon)
                .child(
                  S.documentTypeList("topic")
                    .title("By topic")
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                    .child((topicId) =>
                      S.documentList()
                        .title("Stories")
                        .schemaType("post")
                        .filter('_type == "post" && topic._ref == $topicId')
                        .params({ topicId })
                        .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                    ),
                ),
              S.listItem()
                .title("Lead & picks")
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title("Lead & picks")
                    .schemaType("post")
                    .filter('_type == "post" && (featured == true || editorsPick == true)')
                    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Scheduled")
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title("Scheduled (future date)")
                    .schemaType("post")
                    .filter('_type == "post" && publishedAt > now()')
                    .defaultOrdering([{ field: "publishedAt", direction: "asc" }]),
                ),
            ]),
        ),
      S.documentTypeListItem("topic")
        .title("Topics")
        .icon(TagIcon)
        .child(S.documentTypeList("topic").title("Topics").defaultOrdering([{ field: "order", direction: "asc" }])),
      S.documentTypeListItem("author").title("Authors").icon(UserIcon),
    ]);

/** The "Explore page" tab: the settings document itself, with its live page beside it. */
export const explorePageStructure = (S) =>
  S.document()
    .schemaType("explorePage")
    .documentId("explorePage")
    .title("Explore page")
    .views([S.view.form().title("Edit"), S.view.component(PagePreview).title("Page").icon(EyeOpenIcon)]);

/** Stories also get the "Page" tab when opened from any list. */
export const defaultDocumentNode = (S, { schemaType }) => {
  if (schemaType === "post") {
    return S.document().views([S.view.form().title("Edit"), S.view.component(PagePreview).title("Page").icon(EyeOpenIcon)]);
  }
  return S.document().views([S.view.form()]);
};
