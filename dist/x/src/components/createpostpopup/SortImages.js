"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const styled_components_1 = __importDefault(require("styled-components"));
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const Icons_1 = require("../Icons");
const SortImages = (0, react_1.forwardRef)(({ extraPick, images, setImages, isActive }, ref) => {
    const sort = (result) => {
        if (!result.destination)
            return;
        const newItems = [...images];
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);
        const updatedItems = newItems.map((ni, index) => ({
            src: ni.src,
            index: index.toString(),
        }));
        setImages(updatedItems);
    };
    const remove = (index) => setImages(images
        .filter((img) => img.index != index)
        .map((img, _index) => ({ src: img.src, index: _index.toString() })));
    return (<Container style={{
            width: `${images.length * 90 + (images.length == 10 ? 0 : 110)}px`,
        }} ref={ref} className={isActive ? "active" : ""}>
        <div className="items">
          <react_beautiful_dnd_1.DragDropContext onDragEnd={sort}>
            <react_beautiful_dnd_1.Droppable droppableId="droppable" direction="horizontal">
              {(provided) => (<div className={`in ${images.length == 10 ? `f` : ``}`} style={{
                width: `${images.length * 90}px`,
            }} {...provided.droppableProps} ref={provided.innerRef}>
                  {images.map((item, index) => (<react_beautiful_dnd_1.Draggable draggableId={item.index} index={index}>
                      {(provided) => (<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div className="item">
                            <img src={item.src} alt={item.index}/>

                            <div className="layer"></div>
                            <button onClick={() => remove(item.index)} className="remove">
                              <Icons_1.RemoveIcon />
                            </button>
                          </div>
                        </div>)}
                    </react_beautiful_dnd_1.Draggable>))}
                  {provided.placeholder}
                </div>)}
            </react_beautiful_dnd_1.Droppable>
          </react_beautiful_dnd_1.DragDropContext>
        </div>
        {images.length < 10 && (<button className="add">
            <Icons_1.AddIcon />
            <input onChange={extraPick} type="file" multiple accept="image/jpeg, image/png, image/jpg" name="images" id="images"/>
          </button>)}
      </Container>);
});
const Container = styled_components_1.default.div `
  position: absolute;
  bottom: 4rem;
  right: 4rem;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  cursor: default;
  overflow: hidden;
  transform-origin: bottom right;
  transition: 0.3s ease-in-out all;
  max-width: calc(700px - 6rem);
  height: 0px;
  width: 0px;
  transition: 0.3s ease-in-out all;
  &.active {
    padding-right: 0px;
    padding: 10px;
    height: 100px;
    padding: 10px;
    width: calc(100% - 6rem);
    display: flex;
  }
  .in {
    cursor: default;
    display: flex;
    max-width: 484px;
    &.f {
      max-width: 584px;
    }
    overflow-x: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .item {
      width: 80px;
      height: 80px;
      margin-right: 10px;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      &:hover .remove {
        display: block;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: default;
      }
      .remove {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px;
        display: none;
        position: absolute;
        right: 3px;
        top: 3px;
        width: 22px;
        height: 22px;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 100%;
        border: none !important;
        outline: none !important;
        svg {
          width: 10px;
          height: 10px;
          border: none;
          outline: none;
        }
      }
    }
  }
  button {
    width: 80px;
    height: 80px;
    margin-left: 10px;
    position: relative;
    background-color: transparent;
    border: none;
    outline: none;
    input {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      opacity: 0;
      cursor: pointer;
    }
    svg {
      outline-offset: 10px;
      outline: 1px solid #262626;
      border-radius: 100%;
    }
  }
`;
exports.default = SortImages;
