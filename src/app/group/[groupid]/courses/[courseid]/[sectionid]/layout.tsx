import { onGetSectionInfo } from "@/actions/course"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import SectionNavBar from "./_components/section-navbar"

type CourseContentPageLayout = {
  children: React.ReactNode
  params: {
    sectionid: string
  }
}

const CourseContentPageLayout = async ({
  children,
  params,
}: CourseContentPageLayout) => {
  const client = new QueryClient()
  const { sectionid }= await params

  await client.prefetchQuery({
    queryKey: ["section-info"],
    queryFn: () => onGetSectionInfo(sectionid),
  })

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <SectionNavBar sectionid={sectionid} />
      {children}
    </HydrationBoundary>
  )
}

export default CourseContentPageLayout
