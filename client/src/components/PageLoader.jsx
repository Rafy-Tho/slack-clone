import { LoaderIcon } from 'lucide-react';

function PageLoader() {
  return (
    <div className="bg-slate-700 flex items-center justify-center h-screen">
      <div className="flex items-center justify-center h-16 w-16 ">
        <LoaderIcon className="animate-spin rounded-full h-16 w-16  "></LoaderIcon>
      </div>
    </div>
  );
}

export default PageLoader;
