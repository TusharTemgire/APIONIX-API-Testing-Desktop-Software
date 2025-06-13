import React from 'react'

const page = () => {
  return (
    <div className="bg-[#191515] w-full h-screen">
      <div className="flex items-start justify-center h-full p-2">
        <div className="flex flex-col bg-[#1c1818] border border-[#1f1b1b]/30 h-full w-full p-5 rounded-2xl shadow-sm">
          <div>Hi, I'm Tushar Temgire</div>
          <div className="flex flex-col-2">
            <div className="text-xs text-gray-400 mt-2">
              Software Engineer turned Entrepreneur. I love building things and helping people. Very active on Twitter.
              <br />
              If you have any questions, feel free to reach out to me at{" "}
              <a href="mailto:tushar@example.com" className="text-blue-500">
                tushar@example.com
              </a>
              <img
                src="/netflix-icon.png"
                alt="Description of image"
                className="mt-4 w-28 h-28 rounded-lg shadow-md"
              />
              <div className="text-xs text-gray-500 mt-2">
                About
                <br />
                At the end of 2022, I quit my job as a software engineer to go fulltime into building and scaling my own SaaS businesses. In the past, I pursued a double degree in computer science and business, interned at big tech companies in Silicon Valley, and competed in over 21 hackathons for fun. I also had the pleasure of being a part of the first ever in-person cohort of buildspace called buildspace sf1.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page