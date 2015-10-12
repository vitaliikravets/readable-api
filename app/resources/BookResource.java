package resources;

import hypermedia.annotations.Operation;
import hypermedia.core.BasicResource;
import models.Book;
import models.User;
import models.UserBookConnection;
import controllers.SecurityController;

public class BookResource extends BasicResource {

	@Operation(rel = "mark-as-read", method = "POST")
	public String markAsRead;

	@Operation(rel = "mark-as-planning-to-read", method = "POST")
	public String markAsPlanningToRead;

	public String title;

	public BookResource(Book book) {
		super("/books/" + book.id);
		this.title = book.title;

		if(!SecurityController.isAuthenticated()){
			return;
		}
		if (bookNotMarked(book, UserBookConnection.ConnectionType.READ)) {
			markAsRead = "/books/" + book.id + "/mark?type=READ";
		}
		if (bookNotMarked(book, UserBookConnection.ConnectionType.PLANNING_TO_READ)) {
			markAsPlanningToRead = "/books/" + book.id + "/mark?type=PLANNING_TO_READ";
		}
	}

	private boolean bookNotMarked(Book book, UserBookConnection.ConnectionType type) {
		User user = SecurityController.getAuthenticatedUser();
		return UserBookConnection.find("byBookAndUserAndType", book, user, type).first() == null;
	}

	public String toString() {
		return this.title;
	}
}