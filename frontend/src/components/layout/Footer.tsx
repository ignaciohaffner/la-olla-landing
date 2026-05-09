const FACEBOOK_URL = 'https://www.facebook.com/laollarotiseria'
const INSTAGRAM_URL = 'https://www.instagram.com/laollarotiseria'
const WHATSAPP_URL = 'https://wa.me/543446410459'

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between gap-6">
        <div>
          <p className="font-semibold text-base">La Olla Rotisería</p>
          <p className="mt-1 text-sm text-green-100">Concordia, Entre Ríos</p>
          <p className="text-sm text-green-100">Tel: (344) 641-0459</p>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 min-h-[44px] hover:text-yellow-400 transition-colors"
          >
            Facebook
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 min-h-[44px] hover:text-yellow-400 transition-colors"
          >
            Instagram
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 min-h-[44px] hover:text-yellow-400 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}
