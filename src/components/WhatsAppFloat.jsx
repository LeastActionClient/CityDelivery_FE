import { motion } from 'framer-motion';
import { SITE } from '../utils/config.js';

export default function WhatsAppFloat() {
  const digits = SITE.phone.replace(/\D/g, '');
  const whatsappNumber = digits.length === 10 ? `91${digits}` : digits;
  const href = `https://wa.me/${whatsappNumber}?text=Hello%20City%20Delivery%20Services`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with City Delivery Services on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,.4)] sm:bottom-7 sm:right-7"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-[#25D366]"
        animate={{ scale: [1, 1.45], opacity: [0.65, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        aria-hidden="true"
      />
      <svg viewBox="0 0 24 24" className="relative h-7 w-7 fill-current" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.004 2C6.48 2 2 6.477 2 12c0 1.757.46 3.407 1.262 4.857L2 22l5.255-1.238A9.95 9.95 0 0 0 12.004 22C17.523 22 22 17.523 22 12S17.523 2 12.004 2m0 18.283a8.25 8.25 0 0 1-4.214-1.157l-.302-.18-3.119.735.743-3.04-.197-.312A8.25 8.25 0 1 1 12.004 20.283" />
      </svg>
    </motion.a>
  );
}
