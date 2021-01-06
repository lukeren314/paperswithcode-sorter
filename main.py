from paperswithcode import PapersWithCodeClient
import datetime
from flask import Flask, json, render_template, jsonify, request
from werkzeug.datastructures import Headers

app = Flask(__name__, static_url_path='/static')

client = PapersWithCodeClient()

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/papers')
def papers():
    numPapers = request.args.get("numPapers")

    if numPapers.strip().isdigit():
        numPapers = int(numPapers.strip())
    else:
        response = jsonify({
            "error": "Number of Papers must be a number!"
        })
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

    papers = client.paper_list(items_per_page=numPapers).results
    paper_dict_list = []
    for paper in papers:
        try:
            paper_dict = paper_to_dict(paper)
            paper_dict_list.append(paper_dict)
        except:
            pass
    papersJson = {
        "papers":paper_dict_list
    }
    response = jsonify(papersJson)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

def paper_to_dict(paper):
    return {
        "id":paper.id,
        "url_pdf":paper.url_pdf,
        "title":paper.title,
        "abstract":paper.abstract,
        "authors":paper.authors,
        "published":str(paper.published),
        "repository_list":get_repositories(paper.id),
        "task_list":get_tasks(paper.id)
    }

def get_repositories(paper_id):
    try:
        repository_list = client.paper_repository_list(paper_id)
        repository_dict_list = []
        for repository in repository_list:
            try:
                repository_dict = repository_to_dict(repository)
                repository_dict_list.append(repository_dict)
            except:
                pass
        return repository_dict_list
    except:
        return []
    
def repository_to_dict(repository):
    return {
        "url":repository.url,
        "is_official":repository.is_official,
        "description":repository.description,
        "stars":repository.stars,
        "framework":repository.framework
    }

def get_tasks(paper_id):
    try:
        task_list = client.paper_task_list(paper_id)
        task_dict_list = []
        for task in task_list:
            try:
                task_dict = task_to_dict(task)
                task_dict_list.append(task_dict)
            except:
                pass
        return task_dict_list
    except:
        return []

def task_to_dict(task):
    return {
        "id":task.id,
        "name":task.name,
        "description":task.description
    }

if __name__ == "__main__":
    app.run(port=8000, debug=True)