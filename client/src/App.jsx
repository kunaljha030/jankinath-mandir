import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Visit from "./pages/Visit.jsx";
import Teaching from "./pages/Teaching.jsx";
import Events from "./pages/Events.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Donate from "./pages/Donate.jsx";
import DonateCause from "./pages/DonateCause.jsx";
import Gallery from "./pages/Gallery.jsx";
import Videos from "./pages/Videos.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/teaching" element={<Teaching />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:slug" element={<EventDetail />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donate/:slug" element={<DonateCause />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        {/* Add the other pages here as they are built: Events, Shop, Blog... */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
