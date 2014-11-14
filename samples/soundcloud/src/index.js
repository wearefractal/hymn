/* global document, window */

'use strict';

var React = require('react');
var Player = React.createFactory(require('../../../src'));
var lookup = require('soundcloud-lookup');
var async = require('async');
var attachFastClick = require('fastclick');
attachFastClick(document.body);
window.React = React; // for dev

var songs = [
  'https://soundcloud.com/yung-lean-doer/kyoto-prod-yung-gud',
  'https://soundcloud.com/gud-2/hello',
  'https://soundcloud.com/gud-2/crushed',
  'https://soundcloud.com/gud-2/u-want-me'
];

function lookupSong(url, cb) {
  var key = 'a3e059563d7fd3372b49b37f00a00bcf';
  lookup(url, key, cb);
}

var App = React.createClass({
  displayName: 'demo',
  propTypes: {
    songs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  },
  getInitialState: function(){
    return {
      liked: null,
      songs: null,
      idx: 0
    };
  },
  componentWillMount: function(){
    async.map(this.props.songs, lookupSong, function(err, songs){
      this.setState({
        songs: songs
      });
    }.bind(this));
  },
  lastSong: function(){
    var atStart = (this.state.idx === 0);
    this.setState({
      liked: null,
      idx: (atStart ? this.state.songs.length-1 : --this.state.idx)
    });
  },
  nextSong: function(){
    var atEnd = (this.state.idx === this.state.songs.length-1);
    this.setState({
      liked: null,
      idx: (atEnd ? 0 : ++this.state.idx)
    });
  },
  likeSong: function(){
    this.setState({liked: true});
  },
  dislikeSong: function(){
    this.setState({liked: false});
  },
  currentSong: function(){
    return this.state.songs[this.state.idx];
  },
  render: function(){
    if (!this.state.songs) {
      return null;
    }
    var song = this.currentSong();
    var mp3 = React.DOM.source({
      type: 'audio/mp3',
      src: song.stream_url
    });

    var player = Player({
      ref: 'songPlayer',
      key: this.state.idx,
      autoPlay: true,
      artwork: song.artwork_url.replace('-large', '-t500x500'),
      artist: song.user.username,
      title: song.title,
      onEnd: this.nextSong,
      onSkip: this.nextSong,
      onLike: this.likeSong,
      onDislike: this.dislikeSong
    }, mp3);

    var appClass;
    if (this.state.liked === true) {
      appClass = 'liked';
    } else if (this.state.liked === false) {
      appClass = 'disliked';
    }

    return React.DOM.div({
      className: appClass
    }, player);
  }
});
App = React.createFactory(App);

React.render(App({songs: songs}), document.body);