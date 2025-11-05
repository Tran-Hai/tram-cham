export default function Footer() {
  return (
    <footer className="bg-pastel-pink/80 mt-12">
      <div className="container mx-auto px-6 py-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Trạm Chạm. All rights reserved.</p>
        <p className="mt-1 text-sm">Trạm của những cảm xúc – Chạm của ký ức</p>
      </div>
    </footer>
  );
}
