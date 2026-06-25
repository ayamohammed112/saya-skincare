/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Hot Pink #E8006F
        primary:                      '#E8006F',
        'on-primary':                 '#FFFFFF',
        'primary-fixed':              '#FFB3D1',
        'primary-fixed-dim':          '#F5678B',
        'inverse-primary':            '#FF4DA6',
        'on-primary-fixed':           '#3C0022',
        'on-primary-fixed-variant':   '#7A0048',
        'primary-container':          '#B8005A',
        'on-primary-container':       '#FFE4F0',
        'surface-tint':               '#E8006F',

        // Secondary — Warm Gold
        secondary:                    '#B87C2A',
        'on-secondary':               '#FFFFFF',
        'secondary-container':        '#FFE8B0',
        'on-secondary-container':     '#5C3800',
        'secondary-fixed':            '#FFF5D6',
        'secondary-fixed-dim':        '#E8C070',
        'on-secondary-fixed':         '#3C2400',
        'on-secondary-fixed-variant': '#7A5000',

        // Tertiary — Rose Pink #FF4DA6
        tertiary:                    '#D4558A',
        'on-tertiary':               '#FFFFFF',
        'tertiary-container':        '#B03070',
        'on-tertiary-container':     '#FFD6E8',
        'tertiary-fixed':            '#F5C0D0',
        'tertiary-fixed-dim':        '#F090B8',
        'on-tertiary-fixed':         '#4D0028',
        'on-tertiary-fixed-variant': '#8C0050',

        // Neutral surfaces — White / Soft Blush
        background:                  '#FFF8FC',
        surface:                     '#FFF8FC',
        'surface-bright':            '#FFFFFF',
        'surface-dim':               '#F5D0E0',
        'surface-variant':           '#FCE8F2',
        'surface-container':         '#FFF0F7',
        'surface-container-low':     '#FFF5FA',
        'surface-container-high':    '#FFE8F2',
        'surface-container-highest': '#FFD8EA',
        'surface-container-lowest':  '#FFFFFF',

        // On-surface / text
        'on-surface':         '#1C0D14',
        'on-surface-variant': '#4D2E3A',
        'on-background':      '#1C0D14',
        'inverse-surface':    '#1C0D14',
        'inverse-on-surface': '#FFF5FA',

        // Outline
        outline:          '#C090A8',
        'outline-variant': '#F0C8DC',

        // Error (unchanged)
        error:                '#BA1A1A',
        'on-error':           '#FFFFFF',
        'on-error-container': '#93000A',
        'error-container':    '#FFDAD6',
      },
      fontFamily: {
        garamond: ['"EB Garamond"', 'serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.01em', fontWeight: '500' }],
        'display-mobile': ['36px', { lineHeight: '44px', fontWeight: '500' }],
        'headline-md': ['32px', { lineHeight: '40px', fontWeight: '500' }],
        'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      spacing: {
        'margin-mobile': '16px',
        'margin-desktop': '64px',
        gutter: '24px',
      },
      maxWidth: {
        'site': '1200px',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}


