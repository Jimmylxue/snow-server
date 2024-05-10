export type TBackground = {
	code: string
	imgurl: string
	width: string
	height: string
}

type TBingImageItem = {
	startdate: string
	fullstartdate: string
	enddate: string
	url: string
	urlbase: string
	copyright: string
	copyrightlink: string
	title: string
	quiz: string
	wp: boolean
	hsh: string
	drk: number
	top: number
	bot: number
}

export type TBingImageList = {
	images: TBingImageItem[]
}
