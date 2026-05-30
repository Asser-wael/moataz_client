// helpers.js - functions متكررة في اكتر من ملف

export const capitalize = (text) => 
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

export const getCategoryStyle = (category) => {
  const styles = {
    ps4: "text-blue-400 border-blue-400 bg-blue-400/10",
    ps5: "text-sky-400 border-sky-400 bg-sky-400/10",
    xbox: "text-green-400 border-green-400 bg-green-400/10",
    steam: "text-cyan-300 border-cyan-300 bg-cyan-300/10",
    pc: "text-gray-300 border-gray-500 bg-gray-500/10",
  };
  
  return `border px-3 py-1 rounded-full font-semibold tracking-wide text-xs md:text-sm ${
    styles[category?.toLowerCase()] || "text-yellow-400 border-yellow-400 bg-yellow-400/10"
  }`;
};

export const getStatusStyle = (status) => {
  const styles = {
    completed: "text-sky-400 border-sky-400 bg-sky-400/10",
    rejected: "text-red-400 border-red-400 bg-red-400/10",
    confirmed: "text-cyan-300 border-cyan-300 bg-cyan-300/10",
    pending: "text-gray-300 border-gray-500 bg-gray-500/10",
  };
  
  return `border px-3 py-1 rounded-full font-semibold tracking-wide text-xs md:text-sm ${
    styles[status?.toLowerCase()] || "text-yellow-400 border-yellow-400 bg-yellow-400/10"
  }`;
};

export const formatPrice = (price) => 
  new Intl.NumberFormat("en-US").format(price);