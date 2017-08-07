import React from 'react';
import ytDurationFormat from 'youtube-duration-format';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import 'moment/locale/pt-br';

export class Home extends React.Component {
    constructor(){
        super();
        this.state = {
            videos: [],
            showCount: 4
        }
    }

    componentWillMount() {
        let videos = [];
        let promises = [];

        $.ajax({
            url: "https://www.googleapis.com/youtube/v3/search?",
            method: "GET",
            data: {
                key: 'AIzaSyAvCqJTGTFOLOdcRW0-s3iiMpURupEf388',
                channelId: 'UC5oR1vo1LGgd-OEang8Aqtg',
                part: 'snippet',
                order: 'date',
                maxResults: 8
            }
        }).done((response) => {
            response.items.map((video, i) => {
                let data = {
                    title: video.snippet.title,
                    thumb: video.snippet.thumbnails.default.url,
                    publishedAt: moment(video.snippet.publishedAt).locale('pt').format('LL'),
                    id: video.id.videoId
                }
                videos.push(data);

                promises.push(new Promise((resolve) => {
                    $.ajax({
                        url: "https://www.googleapis.com/youtube/v3/videos?",
                        method: "GET",
                        data: {
                            key: 'AIzaSyAvCqJTGTFOLOdcRW0-s3iiMpURupEf388',
                            id: video.id.videoId,
                            part: 'snippet,contentDetails,statistics'
                        }
                    }).done((resp) => {
                        videos[i].views = resp.items[0].statistics.viewCount;
                        videos[i].duration = ytDurationFormat(resp.items[0].contentDetails.duration);
                        videos[i].description = resp.items[0].snippet.description;
                        
                        resolve()
                    });
                }))
            })

            Promise.all(promises).then(() => {
                this.setState({
                    videos: videos,
                    selectedVideo: videos[0]
                })

                $(".nano").nanoScroller();
            })

        });
    }

    selectVideo(video) {
        this.setState({
            selectedVideo: video
        })
    }

    render() {
        let s = this.state;
        let width = ($('.container-fluid').width() / 12 * 7) - 14;
        
        if (!s.videos.length) {
            return <div></div>
        }
        return (
            <div className="home row" >
                <div className="col-md-7">
                    <h2>Vídeo em destaque</h2>
                    <iframe width={width} height="315" src={'https://www.youtube.com/embed/' + s.selectedVideo.id + '?rel=0'} frameBorder="0" allowFullScreen></iframe>
                    <div className="video-box">
                        <h1>{s.selectedVideo.title}</h1>
                        <div className="icon-infos">
                            <i className="fa fa-clock-o" data-type="light" data-tip={s.selectedVideo.views + ' views'} ></i>
                            <i className="fa fa-eye" data-type="light" data-tip={s.selectedVideo.publishedAt}></i>
                        </div>
                        <p dangerouslySetInnerHTML={{__html: s.selectedVideo.description}}></p>
                    </div>
                </div>

                <div className="col-md-5">
                    <h2>+ Vídeos</h2>
                    <div className=" nano">
                        <div className="nano-content card-box">
                        {s.videos && s.videos.map((item, i) => {
                            if (i < s.showCount)
                                return (
                                    <div className="video-item" key={i} onClick={this.selectVideo.bind(this, item)}>
                                        <div className="img-holder">
                                            <img src={item.thumb} />
                                            <span className="video-duration">{item.duration}</span>
                                        </div>
                                        <div className="info">
                                            <p className="video-title">{item.title}</p>
                                            <p className="video-views"><i className="fa fa-eye"></i> {item.views} views</p>
                                        </div>
                                    </div>
                                )
                        })}
                        {(s.showCount < s.videos.length) ? 
                            <button className="button-more" onClick={() => {this.setState({showCount: 8})}}>CARREGAR MAIS VÍDEOS ...</button>
                        :
                            <button className="button-more" onClick={() => {this.props.setPage('videos')}}>TODOS VÍDEOS</button>
                        }
                        </div>
                    </div>
                    
                </div>
                <ReactTooltip />
            </div>

        )
    }
}