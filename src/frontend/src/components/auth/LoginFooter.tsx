export default function LoginFooter() {
  return (
    <footer className="py-6 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white/80 text-sm">
          <button
            className="hover:text-white transition-colors"
            onClick={() => console.log('About')}
          >
            About
          </button>
          <span className="hidden sm:inline">•</span>
          <button
            className="hover:text-white transition-colors"
            onClick={() => console.log('Privacy Policy')}
          >
            Privacy Policy
          </button>
          <span className="hidden sm:inline">•</span>
          <button
            className="hover:text-white transition-colors"
            onClick={() => console.log('Contact')}
          >
            Contact
          </button>
        </div>
        <div className="text-center text-white/70 text-sm mt-4">
          © 2026 SMART JANGHAI
        </div>
      </div>
    </footer>
  );
}
