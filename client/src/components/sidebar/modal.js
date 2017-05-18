import React from 'react';
import {connect} from 'react-redux';
import './modal.css';

// import {toggleAddBookmark, createBookmarks, editBookmark, updateBookmarks} from './actions';

export class Modal extends React.Component {
    hide(event) {
        event.preventDefault();
        this.props.dispatch(editBookmark(false));
        if (this.props.toggleAdd) {
            this.props.dispatch(toggleAddBookmark());
        }
    }
    postBookmark(e) {
        e.preventDefault();

    }
    
    render() {
        let editValues = this.props.editing ? this.props.editing : "";
        const folderSelect = this.props.folders.map((folder) => {
            return (<option key={folder.folderid} value={folder.folderid}>{folder.foldername}</option>)
        })
        return (
            <div className="overlay" id="modal">
              <form onSubmit={(e) => this.postBookmark(e)}>
                <label htmlFor="url">Bookmark URL<br /></label> 
                <input type="text" name="url" id="url"
                    className="text" autoComplete="off"
                    placeholder="Bookmark URL" required defaultValue={editValues.url} /><br />
                <label htmlFor="title">Bookmark name<br /></label>
                <input type="text" name="title" id="title"
                    className="text" autoComplete="off"
                    placeholder="Bookmark name" required defaultValue={editValues.title} /><br />
                <label htmlFor="notes">Notes<br /></label> 
                <input type="text" name="notes" id="notes"
                    className="text" autoComplete="off"
                    placeholder="Notes" defaultValue={editValues.notes} /><br />
                <label htmlFor="image">Image URL<br /></label> 
                <input type="text" name="image" id="image"
                    className="text" autoComplete="off"
                    placeholder="Image URL" defaultValue={editValues.image} /><br />
                <label htmlFor="folderid">Place in folder<br /></label>
                <select name="folderid">
                    <option value="default">Unorganized PageMarks</option>
                    {folderSelect}
                </select><br />
                <input type="submit" id="submitEditsButton" name="submit" value="Submit" />
              </form>
              <a className="close" href="#" onClick={e => this.hide(e)}>Never mind</a>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({

})
export default connect(mapStateToProps)(Modal);
