import { type PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed header for always visible navbar */}
      <header
        role="banner"
        className="relative w-full z-50 p-4 flex flex-col items-center justify-center bg-brand-surface shadow-md"
      >
        <div className="flex flex-col items-center justify-center w-full pointer-events-none select-none">
          <span className="text-5xl font-bold text-brand-text text-center mt-2 mb-2">pomodoro with me</span>
          <span className="text-base italic text-brand-green mt-1 text-center">Focus gently</span>
        </div>
      </header>
      {/* Add padding top to main to prevent content hiding under navbar */}
      <main role="main" id="main" className="flex-1 p-4 flex flex-col items-center pt-8 sm:pt-8">
        {children}
      </main>
      <footer role="contentinfo" className="p-4 text-center text-sm text-brand-green bg-brand-surface mt-auto">
        © {new Date().getFullYear()} pomodoro with me
      </footer>
    </div>
  );
};

export default Layout;
