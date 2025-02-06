"use client";

import React from 'react'

const MovieDetail = ({ params }: { params: Promise<{ id: string }> }) => {

    const resolvedParams = React.use(params); 

    return <p>Post: {resolvedParams.id}</p>;

}

export default MovieDetail
