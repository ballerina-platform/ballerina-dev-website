import Head from 'next/head'
import styles from '../styles/Home.module.css'

import fs from 'fs';
import matter from 'gray-matter';
import Image from 'next/image';
import Link from 'next/link';

// export async function getStaticProps() {
//   // Get all our posts
//   const files = fs.readdirSync('posts');

//   const posts = files.map((fileName) => {
//     const slug = fileName.replace('.md', '');
//     const readFile = fs.readFileSync(`posts/${fileName}`, 'utf-8');
//     const { data: frontmatter } = matter(readFile);
    
//     return {
//       slug,
//       frontmatter,
//     };
//   });

//   return {
//     props: {
//       posts,
//   },
// };

// }

export default function Home() {
  return (
    <h1>Ballerina Website Rewrite</h1>
  );
}
