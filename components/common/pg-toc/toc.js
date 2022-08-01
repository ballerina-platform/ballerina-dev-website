import * as React from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

export default function Toc(props) {
  const source = props.source;
  let uniqueHeadingList = [];

  const clickMe = (sectionId) => {
    const match = sectionId.match(
      /(?<id_1>(?:\w|-)+)-(?<count>\d+)|((?<id_2>(?:\w|-)+))/
    );
    const id = match.groups.id_1 || match.groups.id_2;
    const sectionNumber = match.groups.count;

    const elements = document.querySelectorAll(`#${id}`);
    let element;

    if (sectionNumber == undefined) {
      element = elements[0];
    } else {
      element = elements[sectionNumber];
    }

    const tocItems = document.querySelectorAll(".title-anchor");
    tocItems.forEach(function (el) {
      el.classList.remove("active");
    });

    location.hash = "#" + sectionId;
    event.target.classList.add("active");
    element.scrollIntoView();
  };

  //Highlight toc on scroll
  const [scroll, setScroll] = React.useState(false);
  React.useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);

      checkVisibleSection();
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

  // get the count of an element in an array
  const getArrayCount = (array, value) => {
    return array.filter((item) => item === value).length;
  };

  const navGen = (source) => {
    const [data, setData] = React.useState({});

    // declare the async data fetching function
    const fetchData = React.useCallback(async () => {
      const file = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(source);

      const level = "";
      const text = "";
      const sectionId = "";

      const match = String(file).match(/h(\d)/);
      if (match.length > 1) {
        const headingLevel = match[1];

        if (headingLevel > 0 && headingLevel < 7) {
          level = `title-level${headingLevel}`;
          text = String(file)
            .match(/<h\d>(.*?)<\/h\d>/g)
            .map(function (val) {
              return val.replace(/<\/?h\d>/g, "");
            });
        }
      }

      sectionId = String(text)
        .replace(/<code>/g, "")
        .replace(/<\/code>/g, "")
        .toLowerCase()
        .replace(/ /g, "-");

      const headingCount = getArrayCount(uniqueHeadingList, sectionId);
      uniqueHeadingList.push(sectionId);
      if (headingCount !== 0) {
        sectionId = sectionId + "-" + headingCount;
      }

      const myObj = {
        level: level,
        text: text,
        sectionId: sectionId,
      };

      setData(myObj);
    }, [source]);

    // the useEffect is only there to call `fetchData` at the right time
    React.useEffect(() => {
      fetchData()
        // make sure to catch any error
        .catch(console.error);
    }, [fetchData]);

    return data;
  };

  function z(content) {
    const myArray = content.split("\n");

    let codeBlockFound = false;
    let newArray = myArray.map((value) => {
      if (value.match(/^```/)) {
        codeBlockFound = !codeBlockFound;
      }
      if (value.match(/^#/) && !codeBlockFound) {
        return navGen(value);
      }
    });
    newArray = newArray.filter(function (element) {
      return element !== undefined;
    });
    return newArray;
  }

  return (
    <>
      <div id="markdown-navigation" className="markdown-navigation">
        {z(source).map((item) => (
          <div
            data-section={item.sectionId}
            className={`title-anchor ${item.level}`}
            onClick={() => clickMe(item.sectionId)}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        ))}
      </div>
    </>
  );
}
