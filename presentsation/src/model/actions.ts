import {AppType, Element} from './type'
import {Mode} from './type'
import {CommandsHistory} from './type'
import {Presentation} from './type'
import {Slide} from './type'
import {Block} from './type'
import {Position} from './type'
import {BlockSize} from './type'
import {Text} from './type'
import {Primitive} from './type'
import {resolveSrv} from "dns";
import {presentation, primitiveType} from "./testData";

export function makeId(): string {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < 8; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export function addTitle(app: AppType, title: string): AppType {
    return {
        ...app,
        presentation: {
            ...app.presentation,
            title,
        }
    }
}

export function addPresentation(app: AppType, title: string): AppType {
    const slide: Slide = {
        slideId: makeId(),
        background: {
            src: '',
            color: '#fff'
        },
        blocks: []
    }

    return {
        ...app,
        presentation: {
            selectElements: [],
            selectSlides: [
                slide.slideId
            ],
            title: title,
            slides: [slide]
        }
    }
}

export function addSlide(app: AppType): AppType {
    const slide: Slide = {
        slideId: makeId(),
        background: {
            src: '',
            color: '#fff'
        },
        blocks: []
    }
    return {
        ...app,
        presentation: {
            ...app.presentation,
            selectSlides: [
                slide.slideId
            ],
            slides: [
                ...app.presentation.slides.slice(0),
                slide
            ]
        }
    }
}

export function selectSlide(app: AppType, slideId: string): AppType {
    addUndo(app, app.presentation)
    return {
        ...app,
        presentation: {
            ...app.presentation,
            selectSlides: [
                slideId
            ]
        }
    }
}

export function ResetSelectElem(app: AppType): AppType {
    return {
        ...app,
        presentation: {
            ...app.presentation,
            selectElements: []
        }
    }
}

export function selectElements(app: AppType, elementId: string): AppType {
    addUndo(app, app.presentation)
    app.presentation = {
        ...app.presentation,
        selectElements: [
            elementId
        ]
    }
    return {
        ...app
    }
}

export function delSlide(app: AppType): AppType {
    addUndo(app, app.presentation)
    let newPresentation = {
        ...app.presentation
    }
    let count = 1
    for (let index1 = 0; index1 != app.presentation.selectSlides.length; index1++) {
        let id = app.presentation.selectSlides[index1]
        for (let index2 = 0; index2 != app.presentation.slides.length; index2++) {
            if (id == app.presentation.slides[index2].slideId && index2 < app.presentation.slides.length-1) {
                newPresentation = {
                    ...app.presentation,
                    slides: [
                        ...app.presentation.slides.slice(0, count-1),
                        ...app.presentation.slides.slice(count)
                    ],
                    selectSlides: [
                        app.presentation.slides[index2+1].slideId
                    ]
                }
                count = 0
                break
            } else if (id == app.presentation.slides[index2].slideId && index2 == app.presentation.slides.length-1) {
                newPresentation = {
                    ...app.presentation,
                    slides: [
                        ...app.presentation.slides.slice(0, count-1),
                        ...app.presentation.slides.slice(count)
                    ],
                    selectSlides: [
                        app.presentation.slides[index2-1].slideId
                    ]
                }
                count = 0
                break 
            }
            count += 1
        }
    }
    return {
        ...app,
        presentation: newPresentation
    }
}

export function moveSlide(app: AppType, slidePosition: number): Presentation {
    addUndo(app, app.presentation)
    let id = ''
    let moveSlide: Slide
    if (app.presentation.selectSlides.length == 1) {
        id = app.presentation.selectSlides[0]
        for (let index = 1; index != app.presentation.slides.length; index++) {
            if (id == app.presentation.slides[index].slideId) {
                moveSlide = app.presentation.slides[index]
                app.presentation = {
                    ...app.presentation,
                    slides: [
                        ...app.presentation.slides.slice(0, index),
                        ...app.presentation.slides.slice(index + 1)
                    ]
                }
                app.presentation = {
                    ...app.presentation,
                    slides: [
                        ...app.presentation.slides.slice(0, slidePosition),
                        moveSlide,
                        ...app.presentation.slides.slice(slidePosition + 2)
                    ]
                }
            }
            break
            index =+ 1
        }
    }
    const newPresentation = app.presentation
    return newPresentation
}

export function changeBackgroundColorSlide(app: AppType, color: string): Presentation {
    addUndo(app, app.presentation)
    for (let countSelectSlide = 0; countSelectSlide != app.presentation.selectSlides.length; countSelectSlide++) {
        let idSelectSlide = app.presentation.selectSlides[countSelectSlide]
        for (let index = 0; index != app.presentation.slides.length; index++) {
            if (idSelectSlide == app.presentation.slides[index].slideId) {
                const slide: Slide = {
                    slideId: idSelectSlide,
                    background: {
                        color: color,
                        src: ''
                    },
                    blocks: app.presentation.slides[index].blocks
                }
                app.presentation = {
                    ...app.presentation,
                    slides: [
                        ...app.presentation.slides.slice(0, index),
                        slide,
                        ...app.presentation.slides.slice(index + 1)
                    ]
                }
            }
        }
    }
    const newPresentation = app.presentation
    return newPresentation
}

export function changeBackgroundImgSlide(app: AppType, img: string): Presentation {
    addUndo(app, app.presentation)
    for (let countSelectSlide = 0; countSelectSlide != app.presentation.selectSlides.length; countSelectSlide++) {
        let idSelectSlide = app.presentation.selectSlides[countSelectSlide]
        for (let index = 0; index != app.presentation.slides.length; index++) {
            if (idSelectSlide == app.presentation.slides[index].slideId) {
                const slide: Slide = {
                    slideId: idSelectSlide,
                    background: {
                        color: '',
                        src: img
                    },
                    blocks: app.presentation.slides[index].blocks
                }
                app.presentation = {
                    ...app.presentation,
                    slides: [
                        ...app.presentation.slides.slice(0, index),
                        slide,
                        ...app.presentation.slides.slice(index + 1)
                    ]
                }
            }
        }
    }
    const newPresentation = app.presentation
    return newPresentation
}

function changeText(app: AppType, text: string): Presentation {
    let idSelectSlide = app.presentation.selectSlides[0]
    for (let index = 0; index != app.presentation.slides.length; index++) {
        if (idSelectSlide == app.presentation.slides[index].slideId) {
            const defaultBlock: Block = {
                blockSize: {
                    height: 100,
                    width: 100
                },
                position: {
                    x: 100,
                    y: 100
                },
                element: {
                    elementId: makeId(),
                    primitive: {
                        colourBack: '',
                        colourLine: '',
                        primitiveType: ''
                    },
                    src: '',
                    text: {
                        bold: false,
                        colorText: 'black',
                        content: text,
                        fontFamily: '',
                        italic: false,
                        size: 20,
                        underline: false
                    }
                }
            }
            const slide: Slide = {
                slideId: idSelectSlide,
                background: app.presentation.slides[index].background,
                blocks: [
                    ...app.presentation.slides[index].blocks.slice(0),
                    defaultBlock
                ]
            }
            app.presentation = {
                ...app.presentation,
                slides: [
                    ...app.presentation.slides.slice(0, index),
                    slide,
                    ...app.presentation.slides.slice(index + 1)
                ]
            }
        }
    }
    const newPresentation = app.presentation
    return newPresentation
}

export function addText(app: AppType, text: string): AppType {
    const newPresentation = changeText(app, text)
    return {
        ...app,
        presentation: newPresentation 
    }
}

function addPrimitiveType(app: AppType, primitiveType: string): Presentation {
    if (app.presentation.selectSlides.length == 1) {
        let idSelectSlide = app.presentation.selectSlides[0]
        for (let index = 0; index != app.presentation.slides.length; index++) {
            if (idSelectSlide == app.presentation.slides[index].slideId) {
                const defaultBlock: Block = {
                    position: {
                        x: 10,
                        y: 10
                    },
                    blockSize: {
                        width: 100,
                        height: 100
                    },
                    element: {
                        elementId: makeId(),
                        src: '',
                        text: {
                            size: 0,
                            content: '',
                            fontFamily: '',
                            colorText: '',
                            bold: false,
                            italic: false,
                            underline: false
                        },
                        primitive: {
                            primitiveType: primitiveType,
                            colourBack: 'red',
                            colourLine: '#000'
                        }
                    }
                }
                const slide: Slide = {
                    slideId: idSelectSlide,
                    background: app.presentation.slides[index].background,
                    blocks: [
                        ...app.presentation.slides[index].blocks.slice(0),
                        defaultBlock
                    ]
                }
                app.presentation = {
                    ...app.presentation,
                    slides: [
                        ...app.presentation.slides.slice(0, index),
                        slide,
                        ...app.presentation.slides.slice(index + 1)
                    ]
                }
            }
        }
    }
    const newPresentation = app.presentation
    return newPresentation
}

export function addPrimitive(app: AppType, primitiveType: string): AppType {
    addUndo(app, app.presentation)
    let newPresentation: Presentation = {
        selectElements: [],
        selectSlides: [],
        slides: [],
        title: ''
    }
    if (primitiveType == 'circle') {
        newPresentation = addPrimitiveType(app, primitiveType)
    } else if (primitiveType == 'triangle') {
        newPresentation = addPrimitiveType(app, primitiveType)
    } else if (primitiveType == 'rectangle') {
        newPresentation = addPrimitiveType(app, primitiveType)
    }
    return {
        ...app,
        presentation: newPresentation
    }
}

export function editPrimitiveColorline(app: AppType, colorLine: string, elementId: string): Presentation {
    addUndo(app, app.presentation)
    if (app.presentation.selectSlides.length == 1) {
        let idSelectSlide = app.presentation.selectSlides[0]
        let indexSelectSlide = 0
        for (indexSelectSlide; indexSelectSlide != app.presentation.slides.length; indexSelectSlide++) {
            if (idSelectSlide == app.presentation.slides[indexSelectSlide].slideId) {
                break
            }
        }
        let indexBlocks = 0
        for (indexBlocks; indexBlocks != app.presentation.slides[indexSelectSlide].blocks.length; indexBlocks++) {
            if (elementId == app.presentation.slides[indexSelectSlide].blocks[indexBlocks].element.elementId) {
                break
            }
        }
        const defaultPrimitive: Primitive = {
            primitiveType: app.presentation.slides[indexSelectSlide].blocks[indexBlocks].element.primitive.primitiveType,
            colourBack: app.presentation.slides[indexSelectSlide].blocks[indexBlocks].element.primitive.colourBack,
            colourLine: colorLine
        }
        const element: Element = {
            ...app.presentation.slides[indexSelectSlide].blocks[indexBlocks].element,
            primitive: defaultPrimitive
        }
        const block: Block = {
            ...app.presentation.slides[indexSelectSlide].blocks[indexBlocks],
            element: element
        }
        const slide: Slide = {
            ...app.presentation.slides[indexSelectSlide],
            blocks: [
                ...app.presentation.slides[indexSelectSlide].blocks.slice(0, indexBlocks),
                block,
                ...app.presentation.slides[indexSelectSlide].blocks.slice(indexBlocks + 1)
            ]
        }
        app.presentation = {
            ...app.presentation,
            slides: [
                ...app.presentation.slides.slice(0, indexSelectSlide),
                slide,
                ...app.presentation.slides.slice(indexSelectSlide + 1)
            ]

        }
    }
    const newPresentation = app.presentation
    return newPresentation
}

function changeImg(app: AppType, src: string): Presentation {
    let idSelectSlide = app.presentation.selectSlides[0]
    for (let index = 0; index != app.presentation.slides.length; index++) {
        if (idSelectSlide == app.presentation.slides[index].slideId) {
            const defaultBlock: Block = {
                blockSize: {
                    height: 100,
                    width: 150
                },
                position: {
                    x: 100,
                    y: 100
                },
                element: {
                    elementId: makeId(),
                    primitive: {
                        colourBack: '',
                        colourLine: '',
                        primitiveType: ''
                    },
                    src: src,
                    text: {
                        bold: false,
                        colorText: 'black',
                        content: '',
                        fontFamily: '',
                        italic: false,
                        size: 12,
                        underline: false
                    }
                }
            }
            const slide: Slide = {
                slideId: idSelectSlide,
                background: app.presentation.slides[index].background,
                blocks: [
                    ...app.presentation.slides[index].blocks.slice(0),
                    defaultBlock
                ]
            }
            app.presentation = {
                ...app.presentation,
                slides: [
                    ...app.presentation.slides.slice(0, index),
                    slide,
                    ...app.presentation.slides.slice(index + 1)
                ]
            }
        }
    }
    const newPresentation = app.presentation
    return newPresentation
}

export function addImg(app: AppType, src: string): AppType {
    addUndo(app, app.presentation)
    const newPresentation = changeImg(app, src)
    return {
        ...app,
        presentation: newPresentation
    }
}

export function editPrimitiveColorback(app: AppType, colorBack: string, elementId: string): Presentation {
    addUndo(app, app.presentation)
    if (app.presentation.selectSlides.length == 1) {
        let idSelectSlide = app.presentation.selectSlides[0]
        let indexSelectSlide = 0
        for (indexSelectSlide; indexSelectSlide != app.presentation.slides.length; indexSelectSlide++) {
            if (idSelectSlide == app.presentation.slides[indexSelectSlide].slideId) {
                break
            }
        }
        let indexBlocks = 0
        for (indexBlocks; indexBlocks != app.presentation.slides[indexSelectSlide].blocks.length; indexBlocks++) {
            if (elementId == app.presentation.slides[indexSelectSlide].blocks[indexBlocks].element.elementId) {
                break
            }
        }
        const defaultPrimitive: Primitive = {
            primitiveType: app.presentation.slides[indexSelectSlide].blocks[indexBlocks].element.primitive.primitiveType,
            colourBack: colorBack,
            colourLine: app.presentation.slides[indexSelectSlide].blocks[indexBlocks].element.primitive.colourLine
        }
        const element: Element = {
            ...app.presentation.slides[indexSelectSlide].blocks[indexBlocks].element,
            primitive: defaultPrimitive
        }
        const block: Block = {
            ...app.presentation.slides[indexSelectSlide].blocks[indexBlocks],
            element: element
        }
        const slide: Slide = {
            ...app.presentation.slides[indexSelectSlide],
            blocks: [
                ...app.presentation.slides[indexSelectSlide].blocks.slice(0, indexBlocks),
                block,
                ...app.presentation.slides[indexSelectSlide].blocks.slice(indexBlocks + 1)
            ]
        }
        app.presentation = {
            ...app.presentation,
            slides: [
                ...app.presentation.slides.slice(0, indexSelectSlide),
                slide,
                ...app.presentation.slides.slice(indexSelectSlide + 1)
            ]
        }
    }
    const newPresentation = app.presentation
    return newPresentation
}

export function delElements(app: AppType): Presentation {
    addUndo(app, app.presentation)
    let idSelectSlide = app.presentation.selectSlides[0]
    let indexSelectSlide = 0
    for (indexSelectSlide; indexSelectSlide != app.presentation.slides.length; indexSelectSlide++) {
        if (idSelectSlide == app.presentation.slides[indexSelectSlide].slideId) {
            break
        }
    }
    let idSelectElement = ''
    let indexSelectElement = 0
    let indexBlocks = 0
    for (indexSelectElement; indexSelectElement != app.presentation.selectElements.length; indexSelectElement++) {
        idSelectElement = app.presentation.selectElements[indexSelectElement]
        for (indexBlocks; indexBlocks != app.presentation.slides[indexSelectSlide].blocks.length; indexBlocks++) {
            if (idSelectElement == app.presentation.slides[indexSelectSlide].blocks[indexBlocks].element.elementId) {
                const blocks = [
                    ...app.presentation.slides[indexSelectSlide].blocks.slice(0, indexBlocks),
                    ...app.presentation.slides[indexSelectSlide].blocks.slice(indexBlocks + 1)
                ]
                const slide: Slide = {
                    ...app.presentation.slides[indexSelectSlide],
                    blocks: blocks
                }
                app.presentation = {
                    ...app.presentation,
                    slides : [
                        ...app.presentation.slides.slice(0, indexSelectSlide),
                        slide,
                        ...app.presentation.slides.slice(indexSelectSlide + 1)
                    ]
                } 
            }
        }
    } 
    const newPresentation = app.presentation
    return newPresentation
}

export function changeBlock(app: AppType, elementId: string, x: number, y: number, wight: number, height: number): Presentation {
    addUndo(app, app.presentation)
    let idSelectSlide = app.presentation.selectSlides[0]
    let indexSelectSlide = 0
    for (indexSelectSlide; indexSelectSlide != app.presentation.slides.length; indexSelectSlide++) {
        if (idSelectSlide == app.presentation.slides[indexSelectSlide].slideId) {
            break
        }
    }
    let indexBlock = 0
    for (indexBlock; indexBlock != app.presentation.slides[indexSelectSlide].blocks.length; indexBlock++) {
        if (elementId == app.presentation.slides[indexSelectSlide].blocks[indexBlock].element.elementId) {
            break
        }
    }
    const block: Block = {
        element: app.presentation.slides[indexSelectSlide].blocks[indexBlock].element,
        blockSize: {
            width: wight,
            height: height
        },
        position: {
            x: x,
            y: y
        }
    }
    const blocks = [
        ...app.presentation.slides[indexSelectSlide].blocks.slice(0, indexBlock),
        block,
        ...app.presentation.slides[indexSelectSlide].blocks.slice(indexBlock + 1)
    ]
    const slide: Slide = {
        ...app.presentation.slides[indexSelectSlide],
        blocks: blocks
    }
    app.presentation = {
        ...app.presentation,
        slides: [
            ...app.presentation.slides.slice(0, indexSelectSlide),
            slide,
            ...app.presentation.slides.slice(indexSelectSlide + 1)
        ]
    }
    const newPresentation = app.presentation
    return newPresentation
}

export function changeMode (app: AppType, mode: Mode): Mode {
    return app.mode = mode
}

export function addUndo (app: AppType, presentation: Presentation): CommandsHistory {
    app.commandsHistory = {
        undo: [
            ...app.commandsHistory.undo.slice(0),
            presentation
        ],
        redo: [
            ...app.commandsHistory.redo.slice(0)
        ]
    }
    const historyUndo = app.commandsHistory
    return historyUndo
}

export function addRedo (app: AppType, presentation: Presentation): CommandsHistory {
    app.commandsHistory = {
        undo: [
            ...app.commandsHistory.undo.slice(0)
        ],
        redo: [
            ...app.commandsHistory.redo.slice(0),
            presentation
        ]
    }
    const historyRedo = app.commandsHistory
    return historyRedo
}

function undo(app: AppType): Presentation {
    const lenArray = app.commandsHistory.undo.length
    app.commandsHistory = {
        undo: [
            ...app.commandsHistory.undo.slice(0, lenArray)
        ],
        redo: [
            ...app.commandsHistory.redo,
            app.commandsHistory.undo[lenArray-1]
        ]
    }
    return app.commandsHistory.undo[lenArray-1]
}

function redo(app: AppType): Presentation {
    const lenArray = app.commandsHistory.redo.length
    app.commandsHistory = {
        undo: [
            ...app.commandsHistory.undo,
            app.commandsHistory.redo[lenArray-1]
        ],
        redo: [
            ...app.commandsHistory.redo.slice(0, lenArray)
        ]
    }
    return app.commandsHistory.redo[lenArray-1]
}