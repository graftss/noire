import * as React from 'react';

export const AboutPane: React.SFC<{}> = () => (
  <div>
    obviously this is pre-pre-pre-pre-alpha. however im working on more
    {'"important"'} stuff for the time being, so i probably wont be making many
    changes to this for a while.
    <br />
    <a href="https://github.com/graftss/noire/">heres the repo</a> if you want
    to help out (this was my first nontrivial typescript project, so a lot of
    the older stuff is pretty goofy looking because i didnt know what i was
    doing).
    <br />
    if you just have a feature request or usage question or bug report or
    whatever, hmu grass#9931
    <br />
    the main big feature i would like to do at some point would be to port this
    to electron to allow for global keyboard and mouse input handling.
  </div>
);
