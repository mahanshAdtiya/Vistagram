export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold text-rose-600 dark:text-rose-400 mb-4">
        Heart’s Desire
      </h1>
      <p className="max-w-xl text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-8">
        An immersive interactive dating sim where your choices shape your love story — all told through full-motion video.
      </p>

      <div className="w-full max-w-sm">
        <label className="text-gray-600 dark:text-gray-300 text-sm mb-2 block">
          Select the chapter you want to configure
        </label>
        {/* <ChapterSelect onChange={handleSelect} className='w-full'/> */}
      </div>
    </div>
  );
}