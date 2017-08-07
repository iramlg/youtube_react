import React from 'react';
import moment from 'moment';
import ytDurationFormat from 'youtube-duration-format';
import ReactTooltip from 'react-tooltip';
import 'moment/locale/pt-br';

export class Videos extends React.Component {
    constructor(){
        super();
        this.state = {
            videos: [],
            nextToken: false,
            selectedVideo: false
        }
    }

    componentWillMount() {
        this.loadNext();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.term !== prevProps.term) {
            this.setState({
                videos: [],
                nextToken: false
            }, () => {
                this.loadNext()
            })
        }
    }

    loadNext() {
        let videos = [];
        let promises = [];
        let data = {
            key: 'AIzaSyAvCqJTGTFOLOdcRW0-s3iiMpURupEf388',
            channelId: 'UC5oR1vo1LGgd-OEang8Aqtg',
            part: 'snippet',
            order: 'date',
            maxResults: 12
        }

        if (this.state.nextToken)
            data.pageToken = this.state.nextToken;

        if (this.props.term)
            data.q = this.props.term;

        $.ajax({
            url: "https://www.googleapis.com/youtube/v3/search?",
            method: "GET",
            data: data
        }).done((response) => {
            if (response.nextPageToken) {
                this.setState({
                    nextToken: response.nextPageToken
                })
            } else {
                this.setState({
                    nextToken: false
                })
            }

            if (!response.items.length) {
                return this.setState({
                    noResults: true
                })
            } else if (response.items.length < 12) {
                this.setState({
                    nextToken: false
                })
            }


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
                        
                        resolve();
                    }).fail(() => {
                        resolve();
                    });
                }))
            })

            Promise.all(promises).then(() => {
                this.setState({
                    videos: this.state.videos.concat(videos),
                    noResults: false
                })
            })

        });
    }

    selectVideo(video) {
        this.setState({
            selectedVideo: video
        })
    }

    onCloseModal() {
        this.setState({
            selectedVideo: false
        })
    }

    render() {
        let s = this.state;
        let p = this.props;



        if (!s.videos.length) {
            return (
                <div className="row videos" >
                    <div className="col-md-12">
                        <h2>Sem resultados para: {p.term}</h2> 
                    </div>
                </div>
            )
        }

        return (
            <div className="row videos" >
                <div className="col-md-12">
                    {p.term ? 
                        <h2>Resultados para: {p.term}</h2>
                    :
                        <h2>Todos os vídeos do Canal</h2>
                    }
                    
                </div>
                {s.videos && s.videos.map((item, i) => {
                    return (
                    <div className="col-md-4" key={i}>
                        <div className="video-item" onClick={this.selectVideo.bind(this, item)}>
                            <div className="img-holder">
                                <img src={item.thumb} />
                                <span className="video-duration">{item.duration}</span>
                            </div>
                            <div className="info">
                                <p className="video-title">{item.title}</p>
                                <p className="video-views"><i className="fa fa-eye"></i> {item.views} views</p>
                            </div>
                        </div>
                    </div>
                    )
                })}
                {s.nextToken && (
                    <div className="col-md-12">
                        <button className="button-more" onClick={this.loadNext.bind(this)}>CARREGAR MAIS VÍDEOS ...</button>
                    </div>
                )}
                {s.selectedVideo && (
                    <div className="modal" style={{display: 'block', paddingRight: 15}}>
                        <div className="modal-backdrop fade in" style={{height: 784}} onClick={this.onCloseModal.bind(this)}></div>
                        <div className="modal-dialog modal-scores" style={{width: 650}}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <i className="fa fa-times-circle pull-right" onClick={this.onCloseModal.bind(this)} ></i>
                                </div>
                                <div className="modal-body">
                                    <iframe width="615" height="315" src={'https://www.youtube.com/embed/' + s.selectedVideo.id + '?rel=0'} frameBorder="0" allowFullScreen></iframe>
                                    <div className="video-box">
                                        <h1>{s.selectedVideo.title}</h1>
                                        <div className="icon-infos">
                                            <i className="fa fa-clock-o" data-type="light" data-tip={s.selectedVideo.views + ' views'} ></i>
                                            <i className="fa fa-eye" data-type="light" data-tip={s.selectedVideo.publishedAt}></i>
                                        </div>
                                        <p dangerouslySetInnerHTML={{__html: s.selectedVideo.description}}></p>
                                    </div>
                                </div>
                                <div className="clear"></div>
                            </div>
                        </div>
                        <ReactTooltip />
                    </div>
                )}
            </div>

        )
    }
}























