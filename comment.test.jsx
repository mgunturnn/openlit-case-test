import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Comment from "./Comment";

jest.mock("axios"); // Mock axios module

describe("Comment Component", () => {
    test("renders component correctly", () => {
        render(<Comment />);

        // Assertions for the rendered component
        expect(screen.getByText("Example Modal")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Insert your caption")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
    });

    test("handles submit comment and displays comments", async () => {
        const mockComment = [
            { username: "user1", comment: "Great post!" },
            { username: "user2", comment: "Nice work!" },
        ];

        axios.get.mockResolvedValueOnce({ data: mockComment }); // Mock axios get request
        axios.post.mockResolvedValueOnce({}); // Mock axios post request

        render(<Comment />);

        // Simulate user interaction
        const textarea = screen.getByPlaceholderText("Insert your caption");
        fireEvent.change(textarea, { target: { value: "Great post!" } });
        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        // Wait for the comment to be posted and displayed
        await waitFor(() => expect(screen.getByText("user1")).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText("Great post!")).toBeInTheDocument());

        // Assertions for the comments
        expect(screen.getByText("user1")).toBeInTheDocument();
        expect(screen.getByText("Great post!")).toBeInTheDocument();
        expect(screen.getByText("user2")).toBeInTheDocument();
        expect(screen.getByText("Nice work!")).toBeInTheDocument();

        // Assertions for axios requests
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/comment/"));
    });
});
