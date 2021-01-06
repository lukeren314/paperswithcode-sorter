from paperswithcode import PapersWithCodeClient

client = PapersWithCodeClient()

papers = client.paper_list(items_per_page=50).results

print(client.paper_method_list(papers[2])[0])