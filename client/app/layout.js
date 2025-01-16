import '../src/styles/globals.css'

export const metadata = {
  title: 'Juego de los Cuatro Colores',
  description: 'Un juego de colorear nodos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}