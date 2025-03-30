import { onAuthenticatedUser } from "@/actions/auth"
import { onGetGroupInfo } from "@/actions/groups"
import { CourseContentForm } from "@/components/forms/course-content"

type Props = {
  params: { sectionid: string; groupid: string }
}

const CourseModuleSection = async ({ params }: Props) => {
  const user = await onAuthenticatedUser()
  const group = await onGetGroupInfo(params.groupid)
  const {sectionid} = await params
  return (
    <CourseContentForm
      groupid={group.group?.userId!}
      sectionid={sectionid}
      userid={user.id!}
    />
  )
}

export default CourseModuleSection
