import * as React from 'react';

import { remark } from 'remark'
// import remarkToc from 'remark-toc'
// import {read} from 'to-vfile'
// import remarkNormalizeHeadings from 'remark-normalize-headings'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import toc from 'rehype-toc';
import parse from 'rehype-parse'
import slug from 'rehype-slug';
import stringify from 'rehype-stringify';


export default function Toc(props) {
  const source = props.source;
  // const [active, setActive] = React.useState('');

  const clickMe = (itemText) => {

    const id = itemText.toString()
      .replace(/<code>/g, '')
      .replace(/<\/code>/g, '')
      .toLowerCase()
      .replace(/ /g, '-');

    const element = document.getElementById(id)
    const tocItems = document.querySelectorAll('.title-anchor');
    tocItems.forEach(function (el) {
      el.classList.remove("active")
    })

    location.hash = '#' + id;
    event.target.classList.add("active");
    element.scrollIntoView();
  }



  //Highlight toc on scroll
  // var nav = document.getElementById("markdown-navigation"),
  //   sections = document.querySelectorAll(".section"),
  //   delay = null;
// console.log(nav);
  const [scroll, setScroll] = React.useState(false);
  React.useEffect(() => {


    // var nav = document.getElementById("markdown-navigation"),
    // sections = document.querySelectorAll(".section"),
    // delay = null;
    
    // document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);

      checkVisibleSection()


    });
  // });
  }, []);


  //---Check the visible section
  function checkVisibleSection() {

    var nav = document.getElementById("markdown-navigation"),
    sections = document.querySelectorAll(".section"),
    delay = null;

    var minor = window.innerHeight,
      section = null;

    //---Select the section closest to the top
    [].forEach.call(sections, function (item) {

      var offset = item.getBoundingClientRect();

      if (Math.abs(offset.top) < minor) {

        minor = Math.abs(offset.top);
console.log(item);
        section = item;

      }

    });


    // React.useEffect(() => {
    //---If the section exists
    if (section) {

      var index = section.dataset.section,
        link = nav.querySelector("div[data-section='" + section.id + "']");
// console.log(link);
      //---If the link is not already active
      if (!link.classList.contains("active")) {

        //---Remove the active class
        nav.querySelector(".title-anchor").classList.remove("active");

        //---Add the active class
        link.classList.add("active");

      }

    }
  // })

  }







  const navGen = (source) => {
    // console.log(source);

    const [data, setData] = React.useState({});
    // declare the async data fetching function
    const fetchData = React.useCallback(async () => {
      const file = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(source)

      const level = '';
      const text = ''
      const sectionId = '';
      //  if()
      // console.log(file);
      // file = String(file).replace(/h2/g,'div');
      // file = file.replace('<div>','<div class="title-anchor title-level2 onClick={() => clickMe()}">')
      if (String(file).indexOf('h2') > -1) {
        level = 'title-level2';
        text = String(file).match(/<h2>(.*?)<\/h2>/g).map(function (val) {
          return val.replace(/<\/?h2>/g, '');
        });
      }

      sectionId = String(text).replace(/<code>/g, '')
        .replace(/<\/code>/g, '')
        .toLowerCase()
        .replace(/ /g, '-');

      // console.log(text);
      const myObj = {
        'level': level,
        'text': text,
        'sectionId': sectionId
      }




      // setData(String(file));
      setData(myObj);
      // console.log(myObj);
    }, [source])

    // the useEffect is only there to call `fetchData` at the right time
    React.useEffect(() => {
      fetchData()
        // make sure to catch any error
        .catch(console.error);;
    }, [fetchData])

    return data

  }



  // const navGen = (source) => {
  //     (async () => await updateCacheForKey(source))();
  //   }

  //   async function updateCacheForKey(source) {
  //     const file = await unified()
  //     .use(remarkParse)
  //     .use(remarkHtml)
  //     .process(source)

  //     example(file)

  //     // console.log(String(file))
  //   }


  //   async function example(file) {
  //     // Create a Rehype processor with the TOC plugin
  //     const processor = unified()
  //       .use(parse)
  //       .use(slug)
  //       .use(toc).use(stringify);

  //     // Read the original HTML file
  //     // let inputHTML = await fs.promises.readFile("input.html");

  //     // Process the HTML, adding heading IDs and Table of Contents
  //     let outputHTML = await processor.process(file);

  //     console.log(String(outputHTML));

  //     // Save the new HTML
  //     // await fs.promises.writeFile("output.html", outputHTML);
  //   }

  const extractHeadings = (value) => {
    if (value.match(/^#/)) {
      return navGen(value);
    }
  }

  function z(content) {
    // console.log(content);
    const myArray = content.split("\n");

    let newArray = (myArray.map(extractHeadings));
    // console.log(newArray)
    newArray = newArray.filter(function (element) {
      return element !== undefined;
    });
    //  console.log(newArray)
    return newArray
  }

  return (
    <>
      <div id='markdown-navigation' className='markdown-navigation'>
        {
          z(source).map(
            (item) =>
              <div
                data-section={item.sectionId}
                className={`title-anchor ${item.level}`}
                onClick={() => clickMe(item.text)}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
          )
        }
      </div>




      {/* {z(source).map((item) =>
    <div className='markdown-navigation '
    dangerouslySetInnerHTML={{__html: item}}
  />
    )} */}
      {/* <div
      dangerouslySetInnerHTML={{__html: z(source)}}
    /> */}
      {/* {z(source)} */}
      {/* {z(source).map((item) =>
                {item}
                )} */}
      {/* <p>vvvvvvvvvvvv {navGen(source)}</p> */}
    </>


  );
}
