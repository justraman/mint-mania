import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <section className="mx-auto container px-6 lg:px-8 mb-10 mt-10">
      <div className="grid grid-cols-1 gap-8 place-content-center lg:grid-cols-3 lg:gap-16">
        <div className="lg:col-span-2 content-center">
          <div className="flex gap-4 ml-2 group w-fit">
            <Skeleton className="h-2 w-8 mb-6" />
          </div>
          <div className="w-full">
            <div className="w-full self-center shadow-2xl relative">
              <Skeleton className="h-[500px] w-full flex" />
            </div>
          </div>
        </div>
        <div className="flex h-full flex-col gap-8">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
