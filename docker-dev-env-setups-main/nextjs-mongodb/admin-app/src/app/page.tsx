import { Services } from "@/components/services/services";


export default function AdminPage(
  {
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }) {



  return (
    <div className="min-w-full">

      <Services />

    </div>
  );
}