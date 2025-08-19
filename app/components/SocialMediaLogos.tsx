import Image from 'next/image';

const socialMediaLogos = [
  { name: 'Instagram', src: '/icons/instagram.svg', gradient: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' },
  { name: 'TikTok', src: '/icons/tiktok.svg', gradient: 'bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400' },
  { name: 'Facebook', src: '/icons/facebook.svg', gradient: 'bg-gradient-to-r from-blue-600 to-blue-800' },
];

export default function SocialMediaLogos() {
  return (
    <div className="flex justify-center space-x-6 py-8">
      {socialMediaLogos.map((logo) => (
        <div
          key={logo.name}
          className={`p-6 rounded-full shadow-lg ${logo.gradient} hover:scale-110 transition-transform`}
        >
          <Image src={logo.src} alt={logo.name} width={50} height={50} />
        </div>
      ))}
    </div>
  );
}