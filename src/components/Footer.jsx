export const Footer = () => {
    return (
        <footer className="mt-12 border-t border-gray-200 bg-white/50 backdrop-blur-sm flex justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} ContactHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    )
}