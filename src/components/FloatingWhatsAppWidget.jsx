import React from 'react';

export default function FloatingWhatsAppWidget() {
  const phone = "919304868696";
  const customBotMessage = encodeURIComponent(
    `🎓 *Hello Backbone Academy Admission Bot!* 👋\n\nI want to connect and inquire about admissions:\n\n1️⃣ Class 1st to 5th Primary Classes (Riya Ma'am)\n2️⃣ Class 5th to 8th Middle School (Shivam Sir)\n3️⃣ Class 9th & 10th Board Prep (Rahul Sir)\n4️⃣ Navodaya Entrance JNVST (Roushan Verma Sir)\n5️⃣ Computer Classes DCA/ADCA/Tally (Subham Pandey Sir)\n6️⃣ 🎁 Book 3 Days Free Trial Demo Class\n\nPlease share course details, fees, and campus batch timings at Pandra Ranchi!`
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${customBotMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      title="Chat with Backbone Academy WhatsApp Bot (+91 9304868696)"
      style={{
        position: 'fixed',
        left: '24px',
        bottom: '30px',
        zIndex: 999,
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        color: '#FFFFFF',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.65)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
        textDecoration: 'none'
      }}
      className="animate-pulse-glow-green"
    >
      {/* Official WhatsApp SVG Logo */}
      <svg 
        width="34" 
        height="34" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.002 3.66 3.745-.993zm11.367-7.633c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    </a>
  );
}
