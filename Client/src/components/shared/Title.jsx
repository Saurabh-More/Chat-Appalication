import React from 'react'
import { Helmet } from 'react-helmet-async';

const  Title = ({title="Chat App",discription="This is the Chat App"}) => 
{
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='discription' content={discription}/>
    </Helmet>
  )
}

export default Title;

