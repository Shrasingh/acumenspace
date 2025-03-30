import { onGetExploreGroup } from "@/actions/groups";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import ExplorePageContent from "../_components/explore-content";

type PageProps = {
  params: { category: string };
};

// ✅ Ensure generateStaticParams is before the component
export function generateStaticParams() {
  return [{ category: "technology" }, { category: "sports" }, { category: "health" }];
}

// ✅ Ensure async function is correctly used
export default async function ExploreCategoryPage({ params }: PageProps) {
  const query = new QueryClient();
  const { category } = params; // Correctly destructure category

  await query.prefetchQuery({
    queryKey: ["groups"],
    queryFn: () => onGetExploreGroup(category, 0),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <ExplorePageContent layout="LIST" category={category} />
    </HydrationBoundary>
  );
}
