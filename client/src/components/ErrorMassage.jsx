export const ErrorMessage = ({
  title = 'Something went wrong',
  message = 'Please try again later.',
  onRetry,
}) => {
  return (
    <div className="bg-slate-700 flex items-center justify-center h-screen">
      <div className="flex min-h-[200px] items-center justify-center px-4 w-full max-w-md">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <div className="mb-3 text-3xl">⚠️</div>

          <h2 className="mb-1 text-lg font-semibold text-red-700">{title}</h2>

          <p className="mb-4 text-sm text-red-600">{message}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
