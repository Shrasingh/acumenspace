import { onGetCourseModules } from "@/actions/course"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { CreateCourseModule } from "../_components/create-module"
import CourseModuleList from "../_components/module-list"

type CourseLayoutProps = {
  params: {
    courseid: string
    groupid: string
  }
  children: React.ReactNode
}

const CourseLayout = async ({ params, children }: CourseLayoutProps) => {
  const client = new QueryClient()
  const { groupid } = await params
  const { courseid } = await params
  await client.prefetchQuery({
    queryKey: ["course-modules"],
    queryFn: () => onGetCourseModules(courseid),
  })

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="grid grid-cols-1 h-full lg:grid-cols-4 overflow-hidden">
        <div className="bg-themeBlack p-5 overflow-y-auto">
          <CreateCourseModule courseId={courseid} groupid={groupid} />
          <CourseModuleList groupid={groupid} courseId={courseid} />
        </div>
        <div className="lg:col-span-3 max-h-full h-full pb-10 overflow-y-auto bg-[#101011]/90">
          {children}
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default CourseLayout
