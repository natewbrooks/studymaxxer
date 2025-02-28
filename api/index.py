from flask import Flask, jsonify, request, send_from_directory
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS, cross_origin
from pytubefix import YouTube
import json
import re
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/api/transcript", methods=['POST', 'GET'])
def yt_to_txt():
    if request.method == 'POST':
        data = request.json
        if not data or 'videoURL' not in data:
            return jsonify({"error": "Missing 'videoURL' in request payload"}), 400

        videoURL = data['videoURL']
        video_id_match = re.search(r"v=([^&]+)", videoURL)
        if not video_id_match:
            return jsonify({"error": "Invalid video URL"}), 400

        video_id = video_id_match.group(1)

        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            combined_text = "\n".join(item["text"] for item in transcript)
            
            yt = YouTube(videoURL)
            pretty_name = yt.title

            folder_path = "./transcripts"
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

            file_path = os.path.join(folder_path, f"{video_id}_transcript.txt")
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(combined_text)
            
            # Return the path relative to the route
            return jsonify({
                "message": "Transcript saved successfully.",
                "file_path": f"/transcripts/{video_id}_transcript.txt",
                "pretty_name": pretty_name
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    elif request.method == "GET":
        # Get the video tag from the query parameter
        videotag = request.args.get('videotag')
        if not videotag:
            return {"error": "Missing videotag parameter"}, 400

        file_name = f"{videotag}_transcript.txt"
        # Ensure the file exists
        file_path = os.path.join('./transcripts', file_name)
        if not os.path.exists(file_path):
            return {"error": "File not found"}, 404

        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        return jsonify({"file_content": content})


@app.route('/api/generate_session', methods=['POST'])
def generate_session():
    if request.method == 'POST':
        data = request.json
        session_name = data.get('sessionName')
        files = data.get('files', [])
        videos = data.get('videos', [])

        if not session_name:
            return jsonify({"error": "Session name is required."}), 400

        session_folder = os.path.join('./sessions', session_name)
        os.makedirs(session_folder, exist_ok=True)

        # Save uploaded files
        for file_info in files:
            file_path = file_info.get('path')
            file_name = file_info.get('name')

            if os.path.exists(file_path):
                dest_path = os.path.join(session_folder, file_name)
                os.rename(file_path, dest_path)

        # Save video metadata
        video_metadata_path = os.path.join(session_folder, 'videos.json')
        with open(video_metadata_path, 'w', encoding='utf-8') as file:
            file.write(json.dumps(videos, indent=4))

        return jsonify({"message": "Session created successfully.", "sessionFolder": session_folder}), 200
