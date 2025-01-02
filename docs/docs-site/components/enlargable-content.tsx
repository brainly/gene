import { useState, useEffect } from 'react';
// import { useTheme } from 'next-themes';

export default function EnlargableContent({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // const overlayBackgroundColor =
  //   theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  // Theme select is disabled
  const overlayBackgroundColor = 'rgba(0, 0, 0, 0.9)';

  return (
    <>
      <div
        onClick={openModal}
        style={{ cursor: 'pointer', display: 'inline-block', width: '100%' }}
      >
        {children}
      </div>

      {isOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: overlayBackgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: '100%',
              maxHeight: '100%',
              overflow: 'auto',
              textAlign: 'center',
            }}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}
