import { Open_Sans } from 'next/font/google'
import './globals.css'

const open_sans = Open_Sans({ subsets: ['latin'] })

import { Providers } from './wrapper'
import NextAuthProvider from '@/context/nextauthProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata = {
  title: "SysMain",
  description: "Management Software",
};

export default async function RootLayout({ children }) {

  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (

    <html lang={locale}>
      <body className={open_sans.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <NextAuthProvider>
              {children}
            </NextAuthProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>


  )
}