"use client"
import React from 'react';
import RemoveBtn from './RemoveBtn';
import Link from 'next/link';
import { FaRegEdit } from "react-icons/fa";

const TodoSection = () => {
  return (
    <div>
      <div>
        <h2>Topic name</h2>
        <div>Topic description</div>
      </div>
      <div>
        <RemoveBtn />
        <Link href="/edit-topic">
          <a>Edit Topic</a>
        </Link>
        <FaRegEdit size={32} />
      </div>
    </div>
  );
};

export default TodoSection;
