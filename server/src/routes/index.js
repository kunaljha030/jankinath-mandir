import { Router } from "express";
import { getSite, getHome, getAbout, getVisit, getTeaching } from "../controllers/contentController.js";
import { getProducts } from "../controllers/productController.js";
import { getPosts, getPostBySlug } from "../controllers/postController.js";
import { getGallery } from "../controllers/galleryController.js";
import { getYoutube } from "../controllers/youtubeController.js";
import { getReels } from "../controllers/reelController.js";
import { getEvents, getEventBySlug, getEventsIcs, getEventIcs } from "../controllers/eventController.js";
import { subscribe } from "../controllers/newsletterController.js";
import { getCauses, getCause, donate } from "../controllers/causeController.js";

const router = Router();

router.get("/site", getSite);          // logo, menu, socials, addresses
router.get("/home", getHome);          // homepage sections
router.get("/about", getAbout);        // About page
router.get("/visit", getVisit);        // "Plan A Visit" page
router.get("/teaching", getTeaching);  // धार्मिक शिक्षा एवं दीक्षा (Teaching) page
router.get("/products", getProducts);  // ?limit=4
router.get("/posts", getPosts);        // ?limit=3&category=news
router.get("/posts/:slug", getPostBySlug);
router.get("/gallery", getGallery);    // ?limit=6
router.get("/reels", getReels);        // Instagram reel links (data/reels.json)
router.get("/youtube", getYoutube);    // live stream if on air, else latest video
router.get("/events", getEvents);      // ?search=&from=&to=&order=desc&aagami=1
router.get("/events/ics", getEventsIcs); // download all upcoming events
router.get("/events/:slug", getEventBySlug);
router.get("/events/:slug/ics", getEventIcs);
router.post("/newsletter", subscribe);
router.get("/causes", getCauses);      // donation causes with progress
router.get("/causes/:slug", getCause);
router.post("/causes/:slug/donate", donate);

export default router;
