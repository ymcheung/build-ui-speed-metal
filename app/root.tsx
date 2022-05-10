import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from '@remix-run/react';
import { useContext, useEffect } from 'react';
import ClientStyleContext from './styles/client.context';
// import { styled } from '~/styles/stitches.config';
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import type { Theme } from './utils/theme'
import { SsrTheme, ThemeMeta, ThemeProvider, useTheme } from './utils/theme'
import { getThemeSession } from './utils/theme-session.server'

type LoaderData = { theme: Theme | null }

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getTheme } = await getThemeSession(request);

  return json<LoaderData>({ theme: getTheme() })
}

const Document = ({ children, title }: DocumentProps) => {
  const clientStyleData = useContext(ClientStyleContext);

  const [theme] = useTheme();

  // Only executed on client
  useEffect(() => {
    // reset cache to re-apply global styles
    clientStyleData.reset();
  }, [clientStyleData]);

  return (
    <html lang="zh-TW">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <ThemeMeta />
        <Links />
        <style id="stitches" dangerouslySetInnerHTML={{ __html: clientStyleData.sheet }} suppressHydrationWarning />
      </head>
      <body>
        {children}
        <SsrTheme serverTheme={!!theme} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export default function AppProviders() {
  const { theme } = useLoaderData<LoaderData>()

  return (
    <ThemeProvider ssrTheme={theme}>
      <App />
    </ThemeProvider>
  )
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <p>
        [CatchBoundary]: {caught.status} {caught.statusText}
      </p>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <p>[ErrorBoundary]: There was an error: {error.message}</p>
    </Document>
  );
}
