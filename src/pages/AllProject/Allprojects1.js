import React, { useState } from "react";
import "./Allprojects.css";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Allprojects() {
  const images = [
    { imgPath: "assets/Allprojects/Commercial/ardete/night/ardete1.jpg" },
    { imgPath: "assets/Allprojects/Commercial/deepak/metasequin/deepak1.jpg" },
    { imgPath: "assets/Allprojects/Commercial/e10/metafin/e101.jpg" },
    { imgPath: "assets/Allprojects/Commercial/gowri/metasequin/gowri1.jpg" },
    { imgPath: "assets/Allprojects/Commercial/metaland/night/metaland1.jpg" },
    { imgPath: "assets/Allprojects/Commercial/micasa/metacoin/micasa1.jpg" },
    { imgPath: "assets/Allprojects/Commercial/tanishq/metacoin/tanishq1.jpg" },
    { imgPath: "assets/Allprojects/Commercial/yashika/metacoin/yashika1.jpg" },
    {
      imgPath:
        "assets/Allprojects/Residential/5107/metacassette-perforated/51072.jpg",
    },
    { imgPath: "assets/Allprojects/Residential/a13-43/metalouver/a13-433.jpg" },
    {
      imgPath:
        "assets/Allprojects/Residential/a18/metacassette-perforated/a181.jpg",
    },
    {
      imgPath:
        "assets/Allprojects/Residential/a19/metacassette-grooved/a1910.jpg",
    },
    { imgPath: "assets/Allprojects/Residential/a297/metaflute/a2971.jpg" },
    {
      imgPath:
        "assets/Allprojects/Residential/Ankit/metacassette-grooved/ankit10.jpg",
    },
    {
      imgPath:
        "assets/Allprojects/Residential/c76fbd/metacassette-grooved/c769.jpg",
    },
    {
      imgPath: "assets/Allprojects/Residential/chandna/metaflute/chandna1.jpg",
    },
    { imgPath: "assets/Allprojects/Residential/dlf4/metaflute/dlf44.jpg" },
    {
      imgPath:
        "assets/Allprojects/Residential/espace/metacassette-perforated/espace2.jpg",
    },
    { imgPath: "assets/Allprojects/Residential/kapil/metacoin/kapil2.jpg" },
    { imgPath: "assets/Allprojects/Residential/Manoj/metacoin/manoj1.jpg" },
    { imgPath: "assets/Allprojects/Residential/Tejbir/metaflute/tejbir4.jpg" },
    {
      imgPath:
        "assets/Allprojects/Residential/Varun/metacassette-grooved/varun2.jpg",
    },
    {
      imgPath:
        "assets/Allprojects/Residential/Vishal/metacassette-perforated/vishal1.jpg",
    },
    { imgPath: "assets/Allprojects/Residential/z1012/metaflute/z10122.jpg" },
  ];

  const navigate = useNavigate(); // Initialize navigate function
  const [selectedCategory, setSelectedCategory] = useState("");
  const singleprojectDetail = [
    {
      name: "ardete",
      Projectname:"Studio Ardete HQ",
      images: [
        "assets/Allprojects/Commercial/ardete/night/ardete1.jpg",
        "assets/Allprojects/Commercial/ardete/night/ardete2.jpg",
        "assets/Allprojects/Commercial/ardete/metasequin/ardete3.jpg",
        "assets/Allprojects/Commercial/ardete/metafin/ardete4.jpg",
        "assets/Allprojects/Commercial/ardete/night/ardete5.jpg",
        "assets/Allprojects/Commercial/ardete/metasequin/ardete6.jpg",
        "assets/Allprojects/Commercial/ardete/night/ardete7.jpg",
        "assets/Allprojects/Commercial/ardete/metafin/ardete8.jpg",
      ],
    },
    {
      name: "deepak Sweets",
      images: [
        "assets/Allprojects/Commercial/deepak/metacassette/deepak6.jpg",
        "assets/Allprojects/Commercial/deepak/metacassette/deepak16.jpg",
        "assets/Allprojects/Commercial/deepak/metapyramid/deepak3.jpg",
        "assets/Allprojects/Commercial/deepak/metapyramid/deepak5.jpg",
        "assets/Allprojects/Commercial/deepak/metapyramid/deepak8.jpg",
        "assets/Allprojects/Commercial/deepak/metapyramid/deepak15.jpg",
        "assets/Allprojects/Commercial/deepak/metasequin/deepak1.jpg",
        "assets/Allprojects/Commercial/deepak/metasequin/deepak2.jpg",
        "assets/Allprojects/Commercial/deepak/metasequin/deepak11.jpg",
        "assets/Allprojects/Commercial/deepak/metasequin/deepak13.jpg",
        "assets/Allprojects/Commercial/deepak/metasequin/deepak14.jpg",
        "assets/Allprojects/Commercial/deepak/night/deepak4.jpg",
        "assets/Allprojects/Commercial/deepak/night/deepak7.jpg",
        "assets/Allprojects/Commercial/deepak/night/deepak9.jpg",
        "assets/Allprojects/Commercial/deepak/night/deepak10.jpg",
        "assets/Allprojects/Commercial/deepak/night/deepak12.jpg",
      ],
    },
    {
      name: "e10",
      images: [
        "assets/Allprojects/Commercial/e10/metafin/e101.jpg",
        "assets/Allprojects/Commercial/e10/metafin/e103.jpg",
        "assets/Allprojects/Commercial/e10/metafin/e105.jpg",
        "assets/Allprojects/Commercial/e10/metafin/e107.jpg",
        "assets/Allprojects/Commercial/e10/metafin/e1010.jpg",
        "assets/Allprojects/Commercial/e10/metafin/e1011.jpg",
        "assets/Allprojects/Commercial/e10/night/e102.jpg",
        "assets/Allprojects/Commercial/e10/night/e104.jpg",
        "assets/Allprojects/Commercial/e10/night/e106.jpg",
        "assets/Allprojects/Commercial/e10/night/e108.jpg",
        "assets/Allprojects/Commercial/e10/night/e109.jpg",
        "assets/Allprojects/Commercial/e10/night/e1012.jpg",
      ],
    },
    {
      name: "gowri",
      images: [
        "assets/Allprojects/Commercial/gowri/metasequin/gowri1.jpg",
        "assets/Allprojects/Commercial/gowri/metasequin/gowri2.jpg",
        "assets/Allprojects/Commercial/gowri/metasequin/gowri3.jpg",
        "assets/Allprojects/Commercial/gowri/metasequin/gowri4.jpg",
        "assets/Allprojects/Commercial/gowri/metasequin/gowri5.jpg",
        "assets/Allprojects/Commercial/gowri/metasequin/gowri6.jpg",
        "assets/Allprojects/Commercial/gowri/metasequin/gowri7.jpg",
        "assets/Allprojects/Commercial/gowri/metasequin/gowri8.jpg",
        "assets/Allprojects/Commercial/gowri/metasequin/gowri9.jpg",
      ],
    },
    {
      name: "metaland",
      images: [
        "assets/Allprojects/Commercial/metaland/metasequin/metaland6.jpg",
        "assets/Allprojects/Commercial/metaland/metasequin/metaland8.jpg",
        "assets/Allprojects/Commercial/metaland/metasequin/metaland9.jpg",
        "assets/Allprojects/Commercial/metaland/metasequin/metaland10.jpg",
        "assets/Allprojects/Commercial/metaland/metasequin/metaland11.jpg",
        "assets/Allprojects/Commercial/metaland/night/metaland1.jpg",
        "assets/Allprojects/Commercial/metaland/night/metaland2.jpg",
        "assets/Allprojects/Commercial/metaland/night/metaland3.jpg",
        "assets/Allprojects/Commercial/metaland/night/metaland4.jpg",
        "assets/Allprojects/Commercial/metaland/night/metaland5.jpg",
        "assets/Allprojects/Commercial/metaland/night/metaland7.jpg",
        "assets/Allprojects/Commercial/metaland/night/metaland12.jpg",
        "assets/Allprojects/Commercial/metaland/night/metaland13.jpg",
      ],
    },
    {
      name: "micasa",
      images: [
        "assets/Allprojects/Commercial/micasa/metacoin/micasa1.jpg",
        "assets/Allprojects/Commercial/micasa/metacoin/micasa2.jpg",
        "assets/Allprojects/Commercial/micasa/metacoin/micasa3.jpg",
        "assets/Allprojects/Commercial/micasa/metacoin/micasa4.jpg",
        "assets/Allprojects/Commercial/micasa/metacoin/micasa5.jpg",
        "assets/Allprojects/Commercial/micasa/metacoin/micasa6.jpg",
        "assets/Allprojects/Commercial/micasa/metacoin/micasa7.jpg",
        "assets/Allprojects/Commercial/micasa/metacoin/micasa8.jpg",
        "assets/Allprojects/Commercial/micasa/metacoin/micasa9.jpg",
      ],
    },
    {
      name: "tanishq",
      images: [
        "assets/Allprojects/Commercial/tanishq/metacoin/tanishq1.jpg",
        "assets/Allprojects/Commercial/tanishq/metacoin/tanishq5.jpg",
        "assets/Allprojects/Commercial/tanishq/metacoin/tanishq6.jpg",
        "assets/Allprojects/Commercial/tanishq/metacoin/tanishq7.jpg",
        "assets/Allprojects/Commercial/tanishq/metacoin/tanishq8.jpg",
        "assets/Allprojects/Commercial/tanishq/metacoin/tanishq9.jpg",
        "assets/Allprojects/Commercial/tanishq/metacoin/tanishq11.jpg",
        "assets/Allprojects/Commercial/tanishq/metaflute/tanishq3.jpg",
        "assets/Allprojects/Commercial/tanishq/metaflute/tanishq10.jpg",
        "assets/Allprojects/Commercial/tanishq/night/tanishq2.jpg",
        "assets/Allprojects/Commercial/tanishq/night/tanishq4.jpg",
        "assets/Allprojects/Commercial/tanishq/night/tanishq12.jpg",
        "assets/Allprojects/Commercial/tanishq/night/tanishq13.jpg",
      ],
    },
    {
      name: "yashika",
      images: [
        "assets/Allprojects/Commercial/yashika/metacoin/yashika1.jpg",
        "assets/Allprojects/Commercial/yashika/metacoin/yashika2.jpg",
        "assets/Allprojects/Commercial/yashika/metacoin/yashika3.jpg",
        "assets/Allprojects/Commercial/yashika/metacoin/yashika4.jpg",
        "assets/Allprojects/Commercial/yashika/metacoin/yashika5.jpg",
        "assets/Allprojects/Commercial/yashika/metacoin/yashika6.jpg",
        "assets/Allprojects/Commercial/yashika/metacoin/yashika7.jpg",
        "assets/Allprojects/Commercial/yashika/metacoin/yashika8.jpg",
        "assets/Allprojects/Commercial/yashika/metacoin/yashika9.jpg",
        "assets/Allprojects/Commercial/yashika/metacoin/yashika10.jpg",
      ],
    },
    {
      name: "5107",
      images: [
        "assets/Allprojects/Residential/5107/metacassette-perforated/51072.jpg",
        "assets/Allprojects/Residential/5107/metacassette-perforated/51073.jpg",
        "assets/Allprojects/Residential/5107/metacassette-perforated/51074.jpg",
        "assets/Allprojects/Residential/5107/metacassette-perforated/51078.jpg",
        "assets/Allprojects/Residential/5107/metacassette-perforated/510710.jpg",
        "assets/Allprojects/Residential/5107/metacassette-perforated/510711.jpg",
        "assets/Allprojects/Residential/5107/night/51071.jpg",
        "assets/Allprojects/Residential/5107/night/51074.jpg",
        "assets/Allprojects/Residential/5107/night/51075.jpg",
        "assets/Allprojects/Residential/5107/night/51077.jpg",
        "assets/Allprojects/Residential/5107/night/51079.jpg",
        "assets/Allprojects/Residential/5107/night/510712.jpg",
        "assets/Allprojects/Residential/5107/night/510713.jpg",
        "assets/Allprojects/Residential/5107/night/510714.jpg",
      ],
    },
    {
      name: "a13-43",
      images: [
        "assets/Allprojects/Residential/a13-43/metalouver/a13-433.jpg",
        "assets/Allprojects/Residential/a13-43/metalouver/a13-437.jpg",
        "assets/Allprojects/Residential/a13-43/metaplank/a13-434.jpg",
        "assets/Allprojects/Residential/a13-43/metaplank/a13-438.jpg",
        "assets/Allprojects/Residential/a13-43/metaplank/a13-4310.jpg",
        "assets/Allprojects/Residential/a13-43/metaplank/a13-4312.jpg",
        "assets/Allprojects/Residential/a13-43/metapyramid/a13-431.jpg",
        "assets/Allprojects/Residential/a13-43/metapyramid/a13-432.jpg",
        "assets/Allprojects/Residential/a13-43/metapyramid/a13-435.jpg",
        "assets/Allprojects/Residential/a13-43/metapyramid/a13-436.jpg",
        "assets/Allprojects/Residential/a13-43/metapyramid/a13-439.jpg",
        "assets/Allprojects/Residential/a13-43/metapyramid/a13-4311.jpg",
        "assets/Allprojects/Residential/a13-43/night/a13-4313.jpg",
        "assets/Allprojects/Residential/a13-43/night/a13-4314.jpg",
        "assets/Allprojects/Residential/a13-43/night/a13-4315.jpg",
      ],
    },
    {
      name: "a18",
      images: [
        "assets/Allprojects/Residential/a18/metacassette-perforated/a181.jpg",
        "assets/Allprojects/Residential/a18/metacassette-perforated/a182.jpg",
        "assets/Allprojects/Residential/a18/metacassette-perforated/a184.jpg",
        "assets/Allprojects/Residential/a18/metacassette-perforated/a185.jpg",
        "assets/Allprojects/Residential/a18/metacassette-perforated/a186.jpg",
        "assets/Allprojects/Residential/a18/metacassette-perforated/a188.jpg",
        "assets/Allprojects/Residential/a18/metacassette-perforated/a1812.jpg",
        "assets/Allprojects/Residential/a18/metacassette-perforated/a1817.jpg",
        "assets/Allprojects/Residential/a18/metacassette-perforated/a1819.jpg",
        "assets/Allprojects/Residential/a18/metaflute/a1819.jpg",
        "assets/Allprojects/Residential/a18/metaflute/a1813.jpg",
        "assets/Allprojects/Residential/a18/metaflute/a1814.jpg",
        "assets/Allprojects/Residential/a18/metaflute/a1815.jpg",
        "assets/Allprojects/Residential/a18/metaflute/a1816.jpg",
        "assets/Allprojects/Residential/a18/metalouver/a183.jpg",
        "assets/Allprojects/Residential/a18/metalouver/a1810.jpg",
        "assets/Allprojects/Residential/a18/metalouver/a1811.jpg",
        "assets/Allprojects/Residential/a18/metalouver/a1818.jpg",
      ],
    },
    {
      name: "a19",
      images: [
        "assets/Allprojects/Residential/a19/metacassette-grooved/a1910.jpg",
        "assets/Allprojects/Residential/a19/metacassette-grooved/a1911.jpg",
        "assets/Allprojects/Residential/a19/metacassette-perforated/a199.jpg",
        "assets/Allprojects/Residential/a19/metaflute/a191.jpg",
        "assets/Allprojects/Residential/a19/metaflute/a192.jpg",
        "assets/Allprojects/Residential/a19/metaflute/a193.jpg",
        "assets/Allprojects/Residential/a19/metaflute/a195.jpg",
        "assets/Allprojects/Residential/a19/metaflute/a196.jpg",
        "assets/Allprojects/Residential/a19/metalouver/a194.jpg",
        "assets/Allprojects/Residential/a19/metalouver/a197.jpg",
        "assets/Allprojects/Residential/a19/metalouver/a198.jpg",
      ],
    },
    {
      name: "a297",
      images: [
        "assets/Allprojects/Residential/a297/metaflute/a2971.jpg",
        "assets/Allprojects/Residential/a297/metaflute/a2973.jpg",
        "assets/Allprojects/Residential/a297/metaflute/a2975.jpg",
        "assets/Allprojects/Residential/a297/metaflute/a2976.jpg",
        "assets/Allprojects/Residential/a297/metaflute/a2979.jpg",
        "assets/Allprojects/Residential/a297/metaflute/a29713.jpg",
        "assets/Allprojects/Residential/a297/metaflute/a29714.jpg",
        "assets/Allprojects/Residential/a297/metagate/a2974.jpg",
        "assets/Allprojects/Residential/a297/metalouver/a2977.jpg",
        "assets/Allprojects/Residential/a297/metalouver/a29712.jpg",
        "assets/Allprojects/Residential/a297/metashingle/a2972.jpg",
        "assets/Allprojects/Residential/a297/metashingle/a2978.jpg",
        "assets/Allprojects/Residential/a297/metashingle/a29710.jpg",
        "assets/Allprojects/Residential/a297/metashingle/a29711.jpg",
      ],
    },
    {
      name: "ankit",
      images: [
        "assets/Allprojects/Residential/Ankit/metacassette-grooved/ankit10.jpg",
        "assets/Allprojects/Residential/ankit/metacassette-grooved/ankit11.jpg",
        "assets/Allprojects/Residential/Ankit/metaflute/ankit6.jpg",
        "assets/Allprojects/Residential/Ankit/metaflute/ankit9.jpg",
        "assets/Allprojects/Residential/Ankit/metafold/ankit4.jpg",
        "assets/Allprojects/Residential/Ankit/metafold/ankit5.jpg",
        "assets/Allprojects/Residential/Ankit/metafold/ankit7.jpg",
        "assets/Allprojects/Residential/Ankit/metafold/ankit8.jpg",
        "assets/Allprojects/Residential/Ankit/metalouver/ankit1.jpg",
        "assets/Allprojects/Residential/Ankit/metalouver/ankit2.jpg",
        "assets/Allprojects/Residential/Ankit/metashingle/ankit3.jpg",
      ],
    },
    {
      name: "c76fbd",
      images: [
        "assets/Allprojects/Residential/c76fbd/metacassette-grooved/c769.jpg",
        "assets/Allprojects/Residential/c76fbd/metacassette-grooved/c7612.jpg",
        "assets/Allprojects/Residential/c76fbd/metacassette-grooved/c7614.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c762.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c763.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c768.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c7610.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c7611.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c7613.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c7615.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c7616.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c7617.jpg",
        "assets/Allprojects/Residential/c76fbd/metaflute/c7618.jpg",
        "assets/Allprojects/Residential/c76fbd/night/c761.jpg",
        "assets/Allprojects/Residential/c76fbd/night/c764.jpg",
        "assets/Allprojects/Residential/c76fbd/night/c765.jpg",
        "assets/Allprojects/Residential/c76fbd/night/c767.jpg",
      ],
    },

       //Luxe
       {
        name: "Luxe",
        images: [
          "assets/Allprojects/residential/Luxe/night/luxe1.png",
          "assets/Allprojects/residential/Luxe/night/luxe2.png",
          "assets/Allprojects/residential/Luxe/night/luxe9.png",
          "assets/Allprojects/residential/Luxe/night/luxe11.png",
          "assets/Allprojects/residential/Luxe/night/luxe14.png",
          "assets/Allprojects/residential/Luxe/night/luxe15.png",
          "assets/Allprojects/residential/Luxe/metasequin/luxe3.png",
          "assets/Allprojects/residential/Luxe/metasequin/luxe5.png",
          "assets/Allprojects/residential/Luxe/metasequin/luxe7.png",
          "assets/Allprojects/residential/Luxe/metaflute/luxe6.png",
          "assets/Allprojects/residential/Luxe/metaflute/luxe13.png",
          "assets/Allprojects/residential/Luxe/metafin/luxe4.png",
          "assets/Allprojects/residential/Luxe/metafin/luxe8.png",
          "assets/Allprojects/residential/Luxe/metafin/luxe10.png",
          "assets/Allprojects/residential/Luxe/metafin/luxe12.png",
        ],
      },
    {
      name: "chandna",
      images: [
        "assets/Allprojects/Residential/chandna/metaflute/chandna1.jpg",
        "assets/Allprojects/Residential/chandna/metaflute/chandna2.jpg",
        "assets/Allprojects/Residential/chandna/metaflute/chandna3.jpg",
        "assets/Allprojects/Residential/chandna/metaflute/chandna4.jpg",
        "assets/Allprojects/Residential/chandna/metaflute/chandna5.jpg",
        "assets/Allprojects/Residential/chandna/metaflute/chandna6.jpg",
        "assets/Allprojects/Residential/chandna/metaflute/chandna7.jpg",
        "assets/Allprojects/Residential/chandna/metaflute/chandna8.jpg",
        "assets/Allprojects/Residential/chandna/metaflute/chandna9.jpg",
      ],
    },
    {
      name: "dlf4",
      images: [
        "assets/Allprojects/Residential/dlf4/metaflute/dlf44.jpg",
        "assets/Allprojects/Residential/dlf4/metaflute/dlf48.jpg",
        "assets/Allprojects/Residential/dlf4/night/dlf41.jpg",
        "assets/Allprojects/Residential/dlf4/night/dlf42.jpg",
        "assets/Allprojects/Residential/dlf4/night/dlf43.jpg",
        "assets/Allprojects/Residential/dlf4/night/dlf45.jpg",
        "assets/Allprojects/Residential/dlf4/night/dlf46.jpg",
        "assets/Allprojects/Residential/dlf4/night/dlf47.jpg",
        "assets/Allprojects/Residential/dlf4/night/dlf49.jpg",
        "assets/Allprojects/Residential/dlf4/night/dlf412.jpg",
        "assets/Allprojects/Residential/dlf4/solid-panel/dlf410.jpg",
        "assets/Allprojects/Residential/dlf4/solid-panel/dlf411.jpg",
      ],
    },
    {
      name: "espace",
      images: [
        "assets/Allprojects/Residential/espace/metacassette-perforated/espace2.jpg",
        "assets/Allprojects/Residential/espace/metacassette-perforated/espace5.jpg",
        "assets/Allprojects/Residential/espace/metacassette-perforated/espace8.jpg",
        "assets/Allprojects/Residential/espace/metacassette-perforated/espace9.jpg",
        "assets/Allprojects/Residential/espace/metacassette-perforated/espace12.jpg",
        "assets/Allprojects/Residential/espace/metalouver-grey/espace3.jpg",
        "assets/Allprojects/Residential/espace/metalouver-grey/espace6.jpg",
        "assets/Allprojects/Residential/espace/metalouver-wood/espace1.jpg",
        "assets/Allprojects/Residential/espace/metalouver-wood/espace4.jpg",
        "assets/Allprojects/Residential/espace/metalouver-wood/espace14.jpg",
        "assets/Allprojects/Residential/espace/metaplank-wood/espace7.jpg",
      ],
    },
    {
      name: "kapil",
      images: [
        "assets/Allprojects/Residential/kapil/metacoin/kapil2.jpg",
        "assets/Allprojects/Residential/kapil/metacoin/kapil3.jpg",
        "assets/Allprojects/Residential/kapil/metacoin/kapil4.jpg",
        "assets/Allprojects/Residential/kapil/metacoin/kapil6.jpg",
        "assets/Allprojects/Residential/kapil/metacoin/kapil8.jpg",
        "assets/Allprojects/Residential/kapil/metacoin/kapil9.jpg",
        "assets/Allprojects/Residential/kapil/metacoin/kapil0.jpg",
        "assets/Allprojects/Residential/kapil/metashingle/kapil1.jpg",
        "assets/Allprojects/Residential/kapil/metashingle/kapil5.jpg",
        "assets/Allprojects/Residential/kapil/metashingle/kapil7.jpg",
      ],
    },
    {
      name: "manoj",
      images: [
        "assets/Allprojects/Residential/Manoj/metacoin/manoj1.jpg",
        "assets/Allprojects/Residential/Manoj/metacoin/manoj8.jpg",
        "assets/Allprojects/Residential/Manoj/metacoin/manoj10.jpg",
        "assets/Allprojects/Residential/Manoj/metacoin/manoj11.jpg",
        "assets/Allprojects/Residential/Manoj/metacoin/manoj4.jpg",
        "assets/Allprojects/Residential/Manoj/metalouver/manoj2.jpg",
        "assets/Allprojects/Residential/Manoj/metalouver/manoj5.jpg",
        "assets/Allprojects/Residential/Manoj/metalouver/manoj7.jpg",
        "assets/Allprojects/Residential/Manoj/metalouver/manoj9.jpg",
        "assets/Allprojects/Residential/Manoj/metaplank/manoj3.jpg",
        "assets/Allprojects/Residential/Manoj/metaplank/manoj6.jpg",
      ],
    },
    {
      name: "tejbir",
      images: [
        "assets/Allprojects/Residential/Tejbir/metaflute/tejbir4.jpg",
        "assets/Allprojects/Residential/Tejbir/metaflute/tejbir6.jpg",
        "assets/Allprojects/Residential/Tejbir/metaflute/tejbir7.jpg",
        "assets/Allprojects/Residential/Tejbir/metalouver/tejbir1.jpg",
        "assets/Allprojects/Residential/Tejbir/metalouver/tejbir2.jpg",
        "assets/Allprojects/Residential/Tejbir/metalouver/tejbir3.jpg",
        "assets/Allprojects/Residential/Tejbir/metalouver/tejbir8.jpg",
        "assets/Allprojects/Residential/Tejbir/metalouver/tejbir11.jpg",
        "assets/Allprojects/Residential/Tejbir/metalouver/tejbir13.jpg",
        "assets/Allprojects/Residential/Tejbir/solid-panel/tejbir5.jpg",
        "assets/Allprojects/Residential/Tejbir/solid-panel/tejbir9.jpg",
        "assets/Allprojects/Residential/Tejbir/solid-panel/tejbir10.jpg",
        "assets/Allprojects/Residential/Tejbir/solid-panel/tejbir12.jpg",
      ],
    },
    {
      name: "varun",
      images: [
        "assets/Allprojects/Residential/Varun/metacassette-grooved/varun2.jpg",
        "assets/Allprojects/Residential/Varun/metacassette-grooved/varun3.jpg",
        "assets/Allprojects/Residential/Varun/metacassette-grooved/varun5.jpg",
        "assets/Allprojects/Residential/Varun/metacassette-grooved/varun7.jpg",
        "assets/Allprojects/Residential/Varun/metacassette-grooved/varun8.jpg",
        "assets/Allprojects/Residential/Varun/metacassette-grooved/varun9.jpg",
        "assets/Allprojects/Residential/Varun/metacassette-grooved/varun11.jpg",
        "assets/Allprojects/Residential/Varun/metacassette-grooved/varun13.jpg",
        "assets/Allprojects/Residential/Varun/metagate/varun10.jpg",
        "assets/Allprojects/Residential/Varun/metagate/varun12.jpg",
        "assets/Allprojects/Residential/Varun/night/varun1.jpg",
        "assets/Allprojects/Residential/Varun/night/varun4.jpg",
        "assets/Allprojects/Residential/Varun/night/varun6.jpg",
      ],
    },
    {
      name: "vishal",
      images: [
        "assets/Allprojects/Residential/Vishal/metacassette-perforated/vishal1.jpg",
        "assets/Allprojects/Residential/Vishal/metacassette-perforated/vishal2.jpg",
        "assets/Allprojects/Residential/Vishal/metacassette-perforated/vishal9.jpg",
        "assets/Allprojects/Residential/Vishal/metacassette-perforated/vishal13.jpg",
        "assets/Allprojects/Residential/Vishal/metacassette-perforated/vishal14.jpg",
        "assets/Allprojects/Residential/Vishal/metaflute/vishal3.jpg",
        "assets/Allprojects/Residential/Vishal/metaflute/vishal4.jpg",
        "assets/Allprojects/Residential/Vishal/metaflute/vishal5.jpg",
        "assets/Allprojects/Residential/Vishal/metaflute/vishal6.jpg",
        "assets/Allprojects/Residential/Vishal/metaflute/vishal8.jpg",
        "assets/Allprojects/Residential/Vishal/metaflute/vishal11.jpg",
        "assets/Allprojects/Residential/Vishal/metalouver/vishal7.jpg",
        "assets/Allprojects/Residential/Vishal/night/vishal10.jpg",
        "assets/Allprojects/Residential/Vishal/night/vishal12.jpg",
      ],
    },
    {
      name: "z1012",
      images: [
        "assets/Allprojects/Residential/z1012/metaflute/z10122.jpg",
        "assets/Allprojects/Residential/z1012/metaflute/z10123.jpg",
        "assets/Allprojects/Residential/z1012/metaflute/z10128.jpg",
        "assets/Allprojects/Residential/z1012/metaflute/z101210.jpg",
        "assets/Allprojects/Residential/z1012/metaflute/z101211.jpg",
        "assets/Allprojects/Residential/z1012/metashingle/z10121.jpg",
        "assets/Allprojects/Residential/z1012/metashingle/z10124.jpg",
        "assets/Allprojects/Residential/z1012/metashingle/z10125.jpg",
        "assets/Allprojects/Residential/z1012/metashingle/z10126.jpg",
        "assets/Allprojects/Residential/z1012/metashingle/z10127.jpg",
        "assets/Allprojects/Residential/z1012/metashingle/z10129.jpg",
      ],
    },
  ];

  function projectClickHandler(img) {
    const selectedSubProjectCat = img.imgPath.split("/")[3];
    const selectedProject = singleprojectDetail.find(
      (item) => item.name === selectedSubProjectCat
    );
    navigate("/single-project", { state: { selectedProject } }); // Redirect to SingleProduct page
  }
  function filterImagesByCategory(category) {
    setSelectedCategory(category);
  }
  // Filter images based on selected category
  const filteredImages = selectedCategory
    ? images.filter((img) => img.imgPath.includes(selectedCategory))
    : images;
  return (
    <Container
      className="app-container text-white"
      style={{ marginTop: "100px" }}
    >
      <Row>
        <Col md={9} className="gallery-project">
          <Row>
            {filteredImages.map((img, index) => (
              <Col
                key={index}
                sm={12}
                md={6}
                lg={4}
                onClick={() => projectClickHandler(img)}
                style={{ padding: "7px" }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${img.imgPath}`}
                  alt={`Gallery ${index}`}
                  className="img-fluid"
                />
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={3} className="sidebar-section">
          <h2 className="text-justify">Our Projects</h2>
          <div className="sidebar p-4">
            <ListGroup variant="flush">
              {/* <ListGroup.Item action variant="dark" style={{color: "#fff"}}>Section</ListGroup.Item> */}
              <ListGroup.Item
                action
                variant="dark"
                className={selectedCategory === "" ? "highlight" : "dim"}
                onClick={() => filterImagesByCategory("")}
              >
                All
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "Residential" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("Residential")}
              >
                Residential
              </ListGroup.Item>
              <ListGroup.Item
                action
                variant="dark"
                className={
                  selectedCategory === "commercial" ? "highlight" : "dim"
                }
                onClick={() => filterImagesByCategory("Commercial")}
              >
                Commercial
              </ListGroup.Item>
            </ListGroup>
          </div>
          <button className="hover-button">
            <span>Build Your Dream</span>
          </button>
        </Col>
      </Row>
    </Container>
  );
}

export default Allprojects;
