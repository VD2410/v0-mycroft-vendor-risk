import TrustCenterWrapper from './TrustCenterWrapper'

export function generateStaticParams() {
  return [{ slug: ['placeholder'] }]
}

export default function Page() { return <TrustCenterWrapper /> }
