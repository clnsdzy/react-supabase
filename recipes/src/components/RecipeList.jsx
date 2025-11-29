import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Coffee } from 'lucide-react';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRecipes() {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('date_created', { ascending: false });

      if (!isMounted) return;

      if (error) {
        setError(error);
        setRecipes([]);
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    }

    fetchRecipes();

    // realtime subscription to keep the list in sync
    // const channel = supabase
    //   .channel('public:recipes')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, () => {
    //     fetchRecipes();
    //   })
    //   .subscribe();

    // return () => {
    //   isMounted = false;
    //   supabase.removeChannel(channel);
    // };
  }, []);


    if (loading)
      return (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );

    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;
    if (!recipes.length) return <div className="alert alert-info">No recipes found.</div>;

    return (
      <div className="container py-3">

        <div className="row">
          {recipes.map((r) => (
            <div key={r.id} className="col-12 col-md-6 col-lg-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{r.name}</h5>
                  {r.description && <p className="card-text">{r.description}</p>}
                  <div className="mt-auto">
                    {r.date_created && (
                      <small className="text-muted">{new Date(r.date_created).toLocaleString()}</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Coffee size={18} />
        Recipes
      </h2>
      <ul>
        {recipes.map((r) => (
          <li key={r.id} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600 }}>{r.name}</div>
            {r.description && <div>{r.description}</div>}
            {r.date_created && (
              <div style={{ fontSize: 12, color: '#666' }}>{new Date(r.date_created).toLocaleString()}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;
