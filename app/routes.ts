import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("work", "routes/work/index.tsx"),
    route("work/:slug", "routes/work/$slug.tsx"),
    route("writing", "routes/writing/index.tsx"),
    route("writing/:slug", "routes/writing/$slug.tsx"),
    route("contact", "routes/contact.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
