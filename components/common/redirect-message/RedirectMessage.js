import * as React from 'react';
import Link from 'next/link';


export default function RedirectMessage(props) {
  let redirect = '';

  if (global.location.pathname.indexOf('learn') > 0) {
    // launcher = launcher + '-learn';
    redirect = <Link href='/learn'>Learn</Link>
  }

  if (global.location.pathname.indexOf('community') > 0) {
    // launcher = launcher + '-learn';
    redirect = <Link href='/community'>Community</Link>
  }

  if (global.location.pathname.indexOf('downloads') > 0) {
    // launcher = launcher + '-learn';
    redirect = <Link href='/downloads'>Downloads</Link>
  }

  return (
    <>
    
    <p>The content you are looking for seems to be obsolete. Please go through our new {redirect} content.</p>

  
    </>
  );
}
